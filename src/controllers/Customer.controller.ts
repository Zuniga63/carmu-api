import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import CashboxTransactionModel from 'src/models/CashboxTransaction.model';
import CustomerModel from 'src/models/Customer.model';
import InvoiceModel from 'src/models/Invoice.model';
import SaleOperationModel from 'src/models/SaleOperation.model';
import {
  CashboxHydrated,
  CashboxTransactionHydrated,
  CustomerContactLite,
  HydratedSaleOperation,
  IInvoicePayment,
  InvoiceHydrated,
} from 'src/types';
import { removeNonNumericChars, removeNonPhoneChars } from 'src/utils';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';
import { validateNewPaymentData, createSaleOperationDescription } from './Invoice.controller';

// ----------------------------------------------------------------------------
//  UTILS
// ----------------------------------------------------------------------------
/**
 * This methos verify the types of properties and remove innecesary characters
 * of the phone.
 * @param contacts Property of request
 * @returns
 */
function getContacts(contacts: unknown) {
  const result: CustomerContactLite[] = [];
  if (contacts && Array.isArray(contacts)) {
    contacts.forEach((item) => {
      const { phone, description } = item;
      if (phone && description && typeof description === 'string') {
        result.push({ phone: removeNonPhoneChars(phone), description });
      }
    });
  }

  return result;
}

// ----------------------------------------------------------------------------
//  API
// ----------------------------------------------------------------------------
interface PendingInvoiceGroup {
  _id: Types.ObjectId;
  balance: number;
  firstPendingInvoice: Date;
  lastPendingInvoice: Date;
  paymentsByInvoices: IInvoicePayment[][];
}
export const list = async (_req: Request, res: Response) => {
  try {
    const customerModels = await CustomerModel.find({}).sort('firstName').sort('lastName');
    // const cashboxs = await CashboxModel.find({}).sort('name').where('openBox').ne(null).select('name openBox');

    const customers = customerModels.map((customer) => customer.toObject());

    const balanceResults = await InvoiceModel.aggregate<PendingInvoiceGroup>()
      .sort('expeditionDate')
      .match({ balance: { $ne: null }, customer: { $ne: null }, cancel: { $ne: true }, isSeparate: { $ne: true } })
      .group({
        _id: '$customer',
        balance: { $sum: '$balance' },
        firstPendingInvoice: { $first: '$expeditionDate' },
        lastPendingInvoice: { $last: '$expeditionDate' },
        paymentsByInvoices: { $push: '$payments' },
      });

    balanceResults.forEach((result) => {
      const paymentDates: Date[] = [];

      result.paymentsByInvoices.forEach((invoicePayments) => {
        invoicePayments.forEach((payment) => {
          paymentDates.push(payment.paymentDate);
        });
      });

      paymentDates.sort();

      const customer = customers.find(({ _id }) => _id.equals(result._id));
      if (customer) {
        customer.balance = result.balance;
        customer.firstPendingInvoice = result.firstPendingInvoice;
        customer.lastPendingInvoice = result.lastPendingInvoice;
        customer.lastPayment = paymentDates.at(-1);
      }
    });
    //

    res.status(200).json(customers);
  } catch (error) {
    sendError(error, res);
  }
};

export const store = async (req: Request, res: Response) => {
  const contacts = getContacts(req.body.contacts);
  try {
    console.log(req.body);
    const customer = await CustomerModel.create({ ...req.body, contacts });
    res.status(201).json(customer);
  } catch (error) {
    sendError(error, res);
  }
};

export const show = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const customerDocument = await CustomerModel.findById(customerId);
    if (!customerDocument) throw new NotFoundError('Cliente no encontrado.');

    const customer = customerDocument.toObject();
    customer.balance = 0;
    const invoices = await InvoiceModel.find({ customer: customer._id }).sort('expeditionDate');

    invoices.forEach((inv) => {
      const { balance } = inv;
      if (customer.balance) {
        customer.balance += balance || 0;
      } else {
        customer.balance = balance;
      }
    });

    customer.invoices = invoices as any;

    res.status(200).json(customer);
  } catch (error) {
    sendError(error, res);
  }
};

export const update = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { firstName, lastName, alias, observation, email, address, documentType, documentNumber, birthDate } = req.body;
  const contacts = getContacts(req.body.contacts);

  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) throw new NotFoundError('Cliente no encontrado.');

    if (firstName) customer.firstName = firstName;
    customer.lastName = lastName;
    customer.alias = alias;
    customer.observation = observation;
    customer.email = email;
    customer.address = address;
    if (birthDate && dayjs(birthDate).isValid()) customer.birthDate = birthDate;

    // Change the document
    if (documentNumber) {
      customer.documentNumber = removeNonNumericChars(documentNumber);
      customer.documentType = documentType || 'CC';
    } else {
      customer.documentType = undefined;
      customer.documentNumber = undefined;
    }

    if (contacts.length > 0) {
      const ids = customer.contacts.map((item) => item._id);
      ids.forEach((id) => {
        customer.contacts.id(id)?.remove();
      });
      customer.contacts.push(...contacts);
    }

    await customer.save({ validateModifiedOnly: true });

    res.status(200).json(customer);
  } catch (error) {
    sendError(error, res);
  }
};

export const destroy = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) throw new NotFoundError('Cliente no encontrado.');

    await customer.remove();

    res.status(200).json({ ok: true });
  } catch (error) {
    sendError(error, res);
  }
};

export const addContact = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { phone, description } = req.body;

  try {
    const customer = await CustomerModel.findById(customerId).select('contacts');
    if (!customer) throw new NotFoundError('Cliente no encontrado');

    customer.contacts.push({ phone: removeNonPhoneChars(phone), description });
    await customer.save({ validateModifiedOnly: true });

    res.status(200).json({ contact: customer.contacts.at(-1) });
  } catch (error) {
    sendError(error, res);
  }
};

export const removeContact = async (req: Request, res: Response) => {
  const { customerId, contactId } = req.params;
  try {
    const customer = await CustomerModel.findById(customerId).select('contacts');
    if (!customer) throw new NotFoundError('Cliente no encontrado');

    const contact = customer.contacts.id(contactId);
    if (!contact) throw new NotFoundError('Contacto no encontrado');
    await Promise.all([contact.remove(), customer.save({ validateModifiedOnly: true })]);

    res.status(200).json({ contact });
  } catch (error) {
    sendError(error, res);
  }
};

/**
 * This menthod update the invoice with the payment and return the operations sales to save
 * @param invoice The invoice to update
 * @param paymentDate The date for payment
 * @param paymentAmount The amount to register payments and operations
 * @param description
 * @returns List of operation sales to save after
 */
const payInvoice = (
  invoice: InvoiceHydrated,
  paymentDate: Date,
  paymentAmount: number,
  description: string,
): HydratedSaleOperation[] => {
  const saleOperations: HydratedSaleOperation[] = [];

  if (invoice.balance && paymentAmount <= invoice.balance) {
    let cashSurplus = paymentAmount;

    // Items are being paid off and create the operation sales
    invoice.items.forEach((item) => {
      if (cashSurplus <= 0 || !item.balance) return;

      // Pay item
      const itemPayment = cashSurplus >= item.balance ? item.balance : cashSurplus;
      item.balance = item.balance - itemPayment || undefined;

      // Register operation type
      saleOperations.push(
        new SaleOperationModel({
          categories: item.categories,
          tags: item.tags,
          operationDate: paymentDate,
          operationType: invoice.isSeparate ? 'separate_payment' : 'credit_payment',
          description: createSaleOperationDescription(invoice, item),
          amount: itemPayment,
        }),
      );

      // Update cash surplus
      cashSurplus -= itemPayment;
    });

    // Credited to the invoice
    invoice.balance = invoice.balance - paymentAmount || undefined;
    invoice.payments.push({
      paymentDate,
      description,
      amount: paymentAmount,
    });

    // Update separate state
    if (invoice.isSeparate) invoice.isSeparate = Boolean(invoice.balance);
  }

  return saleOperations;
};

const getCustomerCredits = (customerId: string) => {
  return InvoiceModel.find({ customer: customerId })
    .where('isSeparate')
    .ne(true)
    .where('cancel')
    .ne(true)
    .where('balance')
    .gt(0)
    .sort('expeditionDate');
};

export const addPayment = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const invoiceToUpdate: InvoiceHydrated[] = [];
  let cashbox: CashboxHydrated | null = null;
  const transactions: CashboxTransactionHydrated[] = [];
  const operationSales: HydratedSaleOperation[] = [];
  const paymentReports: { date: Date; description: string; amount: number }[] = [];

  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) throw new NotFoundError('Cliente no encontrado');

    // Get the all invoice pending for pay
    const invoices = await getCustomerCredits(customerId);
    if (!(invoices.length > 0)) throw new NotFoundError('No hay facturas por pargar');

    const paymentInfo = await validateNewPaymentData(req.body, invoices[0].expeditionDate);
    cashbox = paymentInfo.cashbox;

    let cashSurplus = paymentInfo.amount; // For paid invoice

    invoices.forEach((invoice) => {
      if (cashSurplus <= 0 || !invoice.balance) return;

      const paymentAmount = cashSurplus >= invoice.balance ? invoice.balance : cashSurplus;
      const paymentDate = dayjs(paymentInfo.paymentDate).isBefore(invoice.expeditionDate)
        ? invoice.expeditionDate
        : paymentInfo.paymentDate;

      // Pay invoice
      const invoiceOperations = payInvoice(invoice, paymentDate, paymentAmount, paymentInfo.paymentDescription);

      invoiceToUpdate.push(invoice);
      operationSales.push(...invoiceOperations);

      // Register transactions
      if (paymentInfo.register) {
        const description = `Factura N° ${invoice.prefixNumber}: ${paymentInfo.paymentDescription} - ${customer.fullName}`;
        const transaction = new CashboxTransactionModel({
          cashbox: cashbox?._id,
          transactionDate: paymentDate,
          description,
          amount: paymentAmount,
        });

        if (cashbox) cashbox.transactions.push(transaction._id);

        transactions.push(transaction);
      }

      cashSurplus -= paymentAmount;
      paymentReports.push({
        date: paymentDate,
        description: `Factura N° ${invoice.prefixNumber}`,
        amount: paymentAmount,
      });
    });

    await Promise.all([
      invoiceToUpdate.map((invoice) => invoice.save({ validateBeforeSave: false })),
      transactions.map((transaction) => transaction.save({ validateBeforeSave: false })),
      operationSales.map((op) => op.save({ validateBeforeSave: false })),
      cashbox?.save(),
    ]);

    res.status(200).json({ paymentReports });
  } catch (error) {
    sendError(error, res);
  }
};
