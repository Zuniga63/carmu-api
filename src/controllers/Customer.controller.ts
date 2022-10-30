import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import CustomerModel from 'src/models/Customer.model';
import InvoiceModel from 'src/models/Invoice.model';
import { CustomerContactLite, IInvoicePayment } from 'src/types';
import { removeNonNumericChars, removeNonPhoneChars } from 'src/utils';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';

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

    res.status(200).json({ customers });
  } catch (error) {
    sendError(error, res);
  }
};

export const store = async (req: Request, res: Response) => {
  const contacts = getContacts(req.body.contacts);
  try {
    const customer = await CustomerModel.create({ ...req.body, contacts });
    res.status(201).json({ customer });
  } catch (error) {
    sendError(error, res);
  }
};

export const show = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const customer = await CustomerModel.findById(customerId);
    if (!customer) throw new NotFoundError('Cliente no encontrado.');
    res.status(200).json({ customer });
  } catch (error) {
    sendError(error, res);
  }
};

export const update = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { firstName, lastName, alias, observation, email, address, documentType, documentNumber, birthDate } = req.body;

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

    await customer.save({ validateModifiedOnly: true });

    res.status(200).json({ customer });
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
