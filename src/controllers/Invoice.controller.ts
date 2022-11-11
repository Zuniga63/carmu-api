import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { isValidObjectId, Promise } from 'mongoose';
import CashboxModel from 'src/models/Cashbox.model';
import CashboxTransactionModel from 'src/models/CashboxTransaction.model';
import CustomerModel from 'src/models/Customer.model';
import InvoiceModel from 'src/models/Invoice.model';
import SaleOperationModel from 'src/models/SaleOperation.model';
import UserModel from 'src/models/User.model';
import {
  CashboxHydrated,
  CashboxTransactionHydrated,
  HydratedCustomer,
  HydratedSaleOperation,
  IInvoiceItem,
  IInvoicePayment,
  InvoiceHydrated,
  ProductHydrated,
  UserModelHydrated,
} from 'src/types';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';
import ValidationError from 'src/utils/errors/ValidationError';
import CategoryModel from 'src/models/Category.model';
import ProductModel from 'src/models/Product.model';

// ----------------------------------------------------------------------------
// GET: /invoices
// ----------------------------------------------------------------------------
export async function list(_req: Request, res: Response) {
  try {
    const [invoices, customers, categories, products, cashboxs] = await Promise.all([
      InvoiceModel.find({})
        .sort('expeditionDate')
        .select('-items -payments')
        .populate('customer', 'firstName lastName'),
      CustomerModel.find({}).sort('firstName').sort('lastName'),
      CategoryModel.find({}).where('mainCategory').equals(null).sort('name').select('mainCategory name'),
      ProductModel.find({}).sort('name').select('-images -isInventoriable -sold -returned'),
      CashboxModel.find({}).sort('name').where('openBox').ne(null).select('name openBox'),
    ]);

    res.status(200).json({ invoices, customers, categories, products, cashboxs });
  } catch (error) {
    sendError(error, res);
  }
}

// ----------------------------------------------------------------------------
// POST: /invoices
// ----------------------------------------------------------------------------
interface ICashPayment {
  cashboxId?: string;
  description: string;
  amount: number;
  register: boolean;
}

/**
 * This method complete the data of customer in the invoice.
 * @param invoice Invoice to proccess
 * @param data Request data
 */
const setInvoiceCustomer = async (invoice: InvoiceHydrated, data: any) => {
  const { customerId, customerName, customerAddress, customerPhone, customerDocument, customerDocumentType } = data;
  const customer = await CustomerModel.findById(customerId);

  // Customer data in the invoice
  if (customer) {
    invoice.customer = customer._id;
    invoice.customerName = customer.fullName;
    invoice.customerAddress = customer.address;
    invoice.customerDocument = customer.documentNumber;
    invoice.customerDocumentType = customer.documentType;
    if (customer.contacts.length) invoice.customerPhone = customer.contacts[0].phone;
  }

  // Complete the missing data
  if (invoice.customerName === 'Mostrador' && customerName) invoice.customerName = customerName;
  invoice.customerAddress ??= customerAddress;
  invoice.customerDocument ??= customerDocument;
  invoice.customerDocumentType ??= customerDocumentType;
  invoice.customerPhone ??= customerPhone;
  console.log(invoice);
};

const setInvoiceSeller = async (invoice: InvoiceHydrated, data: any, user?: UserModelHydrated) => {
  const { sellerId, sellerName } = data;

  const seller = (await UserModel.findById(sellerId)) || user;

  // Seller data in the invoices
  if (seller) invoice.seller = seller._id;
  invoice.sellerName = seller ? seller.name : sellerName;
};

const setInvoiceDates = (invoice: InvoiceHydrated, data: any) => {
  const { expeditionDate, expirationDate } = data;

  const now = dayjs();
  let startDate = now.clone();
  let endDate = startDate.clone().add(1, 'month');

  if (expeditionDate && dayjs(expeditionDate).isValid() && !dayjs(expeditionDate).isAfter(now)) {
    startDate = dayjs(expeditionDate);
    endDate = startDate.clone().add(1, 'month');
    if (expirationDate && dayjs(expirationDate).isValid() && dayjs(expirationDate).isAfter(startDate)) {
      endDate = dayjs(expirationDate);
    }
  }

  invoice.expeditionDate = startDate.toDate();
  invoice.expirationDate = endDate.toDate();
};

/**
 * This method guarantiees that cash payment do not exceed the limit or equal
 * @param data Data from request for build cash payments
 * @param limit Limit in money report for invoice
 * @returns cash payment sort by amount
 */
const buildCashPayments = (data: any, limit: number) => {
  let cashAvailable = 0;
  let cashPayments: ICashPayment[] = [];

  if (data && Array.isArray(data)) {
    data.forEach((item) => {
      const { cashboxId, description, amount, register } = item;
      if (description && amount && !isNaN(Number(amount))) {
        cashAvailable += Number(amount);

        const cashPayment: ICashPayment = {
          description: String(description),
          amount: Number(amount),
          register: Boolean(register),
        };

        if (cashboxId && isValidObjectId(cashboxId)) {
          cashPayment.cashboxId = cashboxId;
        }

        cashPayments.push(cashPayment);
      }
    });
  }

  // Sort in order from highest to lowest
  cashPayments.sort((p1, p2) => {
    let value = 0;
    if (p1.amount > p2.amount) value = 1;
    else if (p1.amount < p2.amount) value = -1;
    return value;
  });

  if (cashAvailable > limit) {
    // ? For each payment reduce the remainder to zero
    // ? after map all payments with zero amount are removed
    let remainder = limit;
    cashPayments = cashPayments
      .map((payment) => {
        // All payment are zero
        if (payment.amount <= remainder) remainder -= payment.amount;
        else if (payment.amount > remainder) {
          payment.amount = remainder;
          remainder = 0;
        }

        return payment;
      })
      .filter((item) => item.amount > 0);
  } else if (cashAvailable < limit) {
    // Add a new payment
    cashPayments.push({
      description: 'Efectivo',
      amount: limit - cashAvailable,
      register: true,
    });
  }

  return cashPayments;
};

const buildPaymentsAndTransactions = async (invoice: InvoiceHydrated, cashPaymentsData: unknown) => {
  const cashboxs: CashboxHydrated[] = [];
  const transactions: CashboxTransactionHydrated[] = [];
  const payments: IInvoicePayment[] = [];
  const cashPayments: ICashPayment[] = [];

  if (invoice.cash) {
    const { cash, amount } = invoice;
    const limit = cash > amount ? amount : cash;
    cashPayments.push(...buildCashPayments(cashPaymentsData, limit));

    // Build transactions and invoice payments
    await Promise.all(
      cashPayments.map(async (cashPayment) => {
        if (cashPayment.register) {
          let cashbox: CashboxHydrated | null = null;

          const transaction = new CashboxTransactionModel({
            transactionDate: invoice.expeditionDate,
            description: `Factura N° ${invoice.prefixNumber}: ${cashPayment.description}`,
            amount: cashPayment.amount,
          });

          if (cashPayment.cashboxId) {
            cashbox = await CashboxModel.findById(cashPayment.cashboxId)
              .where('openBox')
              .ne(null)
              .select('openBox transactions');

            if (cashbox) {
              const openBox = dayjs(cashbox.openBox);
              const tDate = dayjs(transaction.transactionDate);
              if (openBox.isValid() && tDate.isValid() && (openBox.isSame(tDate) || openBox.isBefore(tDate))) {
                transaction.cashbox = cashbox._id;
                cashbox.transactions.push(transaction._id);
              }
            }
          }

          transactions.push(transaction);
          if (cashbox) cashboxs.push(cashbox);
        }

        payments.push({
          paymentDate: invoice.expeditionDate,
          description: `Pago inicial: ${cashPayment.description}`,
          initialPayment: true,
          cancel: false,
          amount: cashPayment.amount,
        });
      }),
    );
  }

  return { payments, cashboxs, transactions };
};

const buildSaleOperations = (invoice: InvoiceHydrated) => {
  const saleOperations: HydratedSaleOperation[] = [];

  invoice.items.forEach((item) => {
    const { categories, tags, amount, balance } = item;
    const properties = { categories, tags, operationDate: invoice.expeditionDate };

    const saleAmount = amount - (balance || 0);
    if (saleAmount) {
      const operation = new SaleOperationModel({ ...properties, amount: saleAmount, operationType: 'sale' });
      saleOperations.push(operation);
    }

    if (balance) {
      // Register credit or separate
      saleOperations.push(
        new SaleOperationModel({
          ...properties,
          amount: balance,
          operationType: invoice.isSeparate ? 'separate' : 'credit',
        }),
      );
    }
  });

  return saleOperations;
};

const updateProductStocks = async ({ items }: InvoiceHydrated) => {
  const productUpdates: ProductHydrated[] = [];
  const itemsWithProducts = items.filter((item) => Boolean(item.product));
  const products = await Promise.all(
    itemsWithProducts.map(({ product }) => ProductModel.findById(product).select('stock isInventoriable')),
  );

  if (Array.isArray(products)) {
    (products as (ProductHydrated | null)[]).forEach((product) => {
      if (product && product.isInventoriable) {
        // Get the item with product for get the units to discount
        const item = itemsWithProducts.find((item) => item.product?.equals(product._id));
        if (item) {
          product.stock = product.stock - item.quantity;
          productUpdates.push(product);
        }
      }
    });
  }

  return productUpdates;
};

export async function store(req: Request, res: Response) {
  const data = req.body;
  const { cashPayments, isSeparate } = data;

  try {
    const invoice = new InvoiceModel({ items: data.items, cash: data.cash, isSeparate });

    setInvoiceDates(invoice, data);
    await setInvoiceCustomer(invoice, data);
    await setInvoiceSeller(invoice, data, req.user);

    await invoice.save();

    const { payments, cashboxs, transactions } = await buildPaymentsAndTransactions(invoice, cashPayments);
    const saleOperations = buildSaleOperations(invoice);
    const products = await updateProductStocks(invoice);
    invoice.payments.push(...payments);

    await Promise.all([
      ...cashboxs.map((c) => c.save({ validateBeforeSave: false })),
      ...transactions.map((t) => t.save({ validateBeforeSave: false })),
      ...saleOperations.map((sOp) => sOp.save()),
      ...products.map((p) => p.save({ validateBeforeSave: false })),
      invoice.save(),
    ]);

    const result = await invoice.populate('customer', 'firstName lastName');

    res.status(201).json({ invoice: result });
  } catch (error) {
    sendError(error, res);
  }
}

// ----------------------------------------------------------------------------
// GET: /invoices/:invoiceId
// ----------------------------------------------------------------------------
export async function show(req: Request, res: Response) {
  const { invoiceId } = req.params;
  try {
    const invoice = await InvoiceModel.findById(invoiceId).populate('customer', 'firstName lastName');
    if (!invoice) throw new NotFoundError('Factura no encontrada.');

    res.status(200).json({ invoice });
  } catch (error) {
    sendError(error, res);
  }
}

export const validateNewPaymentData = async (data: any, invoiceDate: Date) => {
  const { paymentDate, description, amount, cashboxId, register } = data;
  const errors: any = {};
  let hasError = false;
  let cashbox: CashboxHydrated | null = null;

  if (!paymentDate) {
    hasError = true;
    errors.paymentDate = {
      name: 'paymentDate',
      message: 'La fecha del pago es requerida.',
      value: paymentDate,
    };
  } else if (!dayjs(paymentDate).isValid()) {
    hasError = true;
    errors.paymentDate = {
      name: 'paymentDate',
      message: 'La fecha no tiene un formato válido.',
      value: paymentDate,
    };
  } else if (dayjs(paymentDate).isAfter(dayjs())) {
    hasError = true;
    errors.paymentDate = {
      name: 'paymentDate',
      message: 'Es una fecha invalida.',
      value: paymentDate,
    };
  } else if (dayjs(paymentDate).isBefore(invoiceDate)) {
    hasError = true;
    errors.paymentDate = {
      name: 'paymentDate',
      message: 'El pago es anterior a la factura',
      value: paymentDate,
    };
  }

  if (!description) {
    hasError = true;
    errors.description = {
      name: 'description',
      message: 'Se requiere una descripción.',
      value: '',
    };
  }

  // validate amount
  if (!amount) {
    hasError = true;
    errors.amount = {
      name: 'amount',
      message: 'El importe del pago es requerido',
      value: amount,
    };
  } else if (isNaN(Number(amount))) {
    hasError = true;
    errors.amount = {
      name: 'amount',
      message: 'Se requeire un numero válido',
      value: amount,
    };
  } else if (Number(amount) < 0.01) {
    hasError = true;
    errors.amount = {
      name: 'amount',
      message: 'El importe debe ser mayor o igual que $0.01.',
      value: amount,
    };
  }

  // Validate the optional cashboxId
  if (cashboxId && Boolean(register)) {
    if (!isValidObjectId(cashboxId)) {
      hasError = true;
      errors.cashboxId = {
        name: 'cashboxIs',
        message: 'El ID de la caja no tiene un formato válido.',
        value: cashboxId,
      };
    } else {
      cashbox = await CashboxModel.findById(cashboxId).select('name openBox transactions');
      if (!cashbox) {
        hasError = true;
        errors.cashboxId = {
          name: 'cashboxId',
          message: 'La caja seleccionada no existe.',
          value: cashboxId,
        };
      } else if (!cashbox.openBox) {
        hasError = true;
        errors.cashboxId = {
          name: 'cashboxId',
          message: 'La caja no se encuentra operativa.',
          value: cashboxId,
        };
      } else if (!errors.paymentDate && dayjs(cashbox.openBox).isAfter(paymentDate)) {
        hasError = true;
        errors.cashboxId = {
          name: 'cashboxId',
          message: 'La caja empezo a operar posterior al pago.',
          value: cashboxId,
        };
      }
    }
  }

  if (hasError) throw new ValidationError('Error de validación', errors);

  return {
    paymentDate: dayjs(paymentDate).toDate(),
    paymentDescription: String(description),
    amount: Number(amount),
    cashbox,
    register: Boolean(register),
  };
};

export async function addPayment(req: Request, res: Response) {
  const { invoiceId } = req.params;
  const info: {
    items: IInvoiceItem[];
    payment: IInvoicePayment | undefined;
    invoice: any | undefined;
    transaction: CashboxTransactionHydrated | undefined;
    saleOperations: HydratedSaleOperation[];
    message: string;
  } = {
    items: [],
    payment: undefined,
    invoice: undefined,
    transaction: undefined,
    saleOperations: [],
    message: '¡La factura ya fue pagada!',
  };

  try {
    const invoice = await InvoiceModel.findById(invoiceId).populate<{ customer: HydratedCustomer }>(
      'customer',
      'firstName lastName alias',
    );
    if (!invoice) throw new NotFoundError('Factura no encontrada.');

    if (invoice.balance) {
      const { paymentDate, paymentDescription, amount, cashbox, register } = await validateNewPaymentData(
        req.body,
        invoice.expeditionDate,
      );
      const paymentAmount = amount > invoice.balance ? invoice.balance : amount;
      const saleOperations: HydratedSaleOperation[] = [];

      let transaction: CashboxTransactionHydrated | null = null;
      let cashSurplus = paymentAmount; // to pay off items

      // Register payment in the invoice
      invoice.payments.push({
        paymentDate,
        description: paymentDescription,
        amount: paymentAmount,
      });

      // Pay off items
      invoice.items.forEach((item) => {
        if (cashSurplus > 0 && item.balance) {
          const itemPayment = item.balance >= cashSurplus ? cashSurplus : item.balance;
          item.balance = item.balance - itemPayment || undefined;

          const operationType = invoice.isSeparate ? 'separate_payment' : 'credit_payment';
          saleOperations.push(
            new SaleOperationModel({
              categories: item.categories,
              tags: item.tags,
              operationDate: paymentDate,
              operationType,
              amount: itemPayment,
            }),
          );

          info.items.push(item);
          cashSurplus -= itemPayment;
        }
      });

      // Update the invoice balance
      invoice.balance = invoice.balance - paymentAmount || undefined;
      if (invoice.isSeparate) invoice.isSeparate = Boolean(invoice.balance); // Change this state
      info.message = invoice.balance ? '¡Abono realizado con éxito!' : '¡Factura pagada!';

      // Register transaction in global or cashbox
      if (register) {
        let description = `Factura N° ${invoice.prefixNumber}: ${paymentDescription} - `;
        description += invoice.customer?.fullName || invoice.customerName;

        transaction = new CashboxTransactionModel({
          transactionDate: paymentDate,
          description,
          amount: paymentAmount,
        });

        if (cashbox) {
          cashbox.transactions.push(transaction._id);
          transaction.cashbox = cashbox._id;
        }

        info.transaction = transaction;
      }

      // Finally save all documents
      await Promise.all([
        invoice.save({ validateModifiedOnly: true }),
        transaction?.save({ validateBeforeSave: false }),
        cashbox?.save({ validateBeforeSave: false }),
        ...saleOperations.map((sOp) => sOp.save()),
      ]);

      info.payment = invoice.payments.at(-1) as IInvoicePayment;
      info.invoice = invoice;
      info.saleOperations = saleOperations;
    }

    res.status(200).json({ ...info });
  } catch (error) {
    sendError(error, res);
  }
}
