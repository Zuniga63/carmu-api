import { HydratedDocument, Types } from 'mongoose';

export type UserRole = 'admin' | 'editor' | 'seller' | 'user';

export interface IImage {
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  type?: string;
  url?: string;
}

export interface registerBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUserModel {
  name: string;
  email: string;
  emailVerifiedAt?: string | Date;
  password: string;
  rememberToken?: string;
  profilePhoto?: IImage;
  role?: UserRole;
  employee?: Types.ObjectId;
  customer?: Types.ObjectId;
  boxes: Types.ObjectId[];
}

export type UserModelHydrated = HydratedDocument<IUserModel>;

// ----------------------------------------------------------------------------
// CATEGORIES
// ----------------------------------------------------------------------------
export interface ICategory {
  mainCategory?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: IImage;
  level: number;
  order: number;
  isEnabled: boolean;
  products: Types.ObjectId[];
  subcategories: Types.ObjectId[];
  urlSlug: string;
}

export type CategoryHydrated = HydratedDocument<ICategory>;

export type StoreCategoryRequest = Pick<ICategory, 'name' | 'description' | 'image'>;
export interface UpdateCategoryRequest extends Pick<ICategory, 'name' | 'description' | 'image'> {
  isEnabled?: string;
  order?: string;
}

// ----------------------------------------------------------------------------
// CASHBOX
// ----------------------------------------------------------------------------

export interface ICashbox {
  cashier?: Types.ObjectId;
  users: Types.ObjectId[];
  name: string;
  cashierName?: string;
  base: number;
  balance?: number;
  openBox?: Date;
  closed?: Date;
  transactions: Types.ObjectId[];
  closingRecords: Types.ObjectId[];
}

export type CashboxHydrated = HydratedDocument<ICashbox>;

export interface ICashboxTransaction {
  cashbox?: Types.ObjectId;
  transactionDate: Date;
  description: string;
  isTransfer?: boolean;
  amount: number;
}

export interface IMainBox {
  name: string;
  balance: number;
  transactions?: ICashboxTransaction[];
}

export type CashboxTransactionHydrated = HydratedDocument<ICashboxTransaction>;

export interface IMonetaryValue {
  denomination: string;
  value: number;
  count: number;
}

export interface ICashClosingRecord {
  cashbox?: Types.ObjectId;
  user?: Types.ObjectId;
  cashier?: Types.ObjectId;
  userName?: string;
  cashierName?: string;
  boxName?: string;
  opened: Date;
  closingDate: Date;
  base: number;
  incomes?: number;
  expenses?: number;
  cash: number;
  coins?: IMonetaryValue[];
  bills?: IMonetaryValue[];
  leftover?: number;
  missing?: number;
  observation?: string;
  transactions: Types.ObjectId[];
}

export type CashClosingRecordHydrated = HydratedDocument<ICashClosingRecord>;

// ----------------------------------------------------------------------------
// VALIDATIONS
// ----------------------------------------------------------------------------
export interface IValidationErrors {
  [key: string]: {
    name: string;
    message: string;
    kind?: string;
    path?: string;
    value?: string;
  };
}

// ----------------------------------------------------------------------------
// CUSTOMER
// ----------------------------------------------------------------------------
export interface ICustomerContact {
  _id: Types.ObjectId;
  phone: string;
  description: string;
}

export type CustomerContactLite = Omit<ICustomerContact, '_id'>;

export type DocumentType = 'CC' | 'TI' | 'NIT' | 'PAP';

export interface ICustomer {
  user?: Types.ObjectId;
  firstName: string;
  lastName?: string;
  alias?: string;
  observation?: string;
  email?: string;
  contacts: ICustomerContact[];
  address?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  birthDate?: Date;
  profilePhoto?: IImage;
  invoices: Types.ObjectId[];
  fullName: string;
  balance?: number;
  firstPendingInvoice?: Date;
  lastPendingInvoice?: Date;
  lastPayment?: Date;
}

export type CustomerDocumentProps = {
  contacts: Types.DocumentArray<ICustomerContact>;
};

export type HydratedCustomer = HydratedDocument<ICustomer & CustomerDocumentProps>;

// ----------------------------------------------------------------------------
// PRODUCTS
// ----------------------------------------------------------------------------
export interface IProduct {
  categories: Types.ObjectId[];
  tags: Types.ObjectId[];
  colors: Types.ObjectId[];
  sizes: Types.ObjectId[];
  name: string;
  slug: string;
  ref?: string;
  barcode?: string;
  description?: string;
  productSize?: string;
  image?: IImage;
  images: Types.ObjectId[];
  isInventoriable: boolean;
  stock: number;
  price: number;
  hasDiscount: boolean;
  priceWithDiscount?: number;
  productIsNew: boolean;
  published: boolean;
  sold: number;
  returned: number;
}

export type ProductHydrated = HydratedDocument<IProduct>;

// ----------------------------------------------------------------------------
// INVOICE
// ----------------------------------------------------------------------------
export interface IInvoiceItem {
  categories: Types.ObjectId[];
  product?: Types.ObjectId;
  productSize?: Types.ObjectId;
  productColor?: Types.ObjectId;
  tags: Types.ObjectId[];
  description: string;
  quantity: number;
  unitValue: number;
  discount?: number;
  amount: number;
  balance?: number;
  cancel: boolean;
  cancelMessage?: string;
}

export interface IInvoicePayment {
  paymentDate: Date;
  description?: string;
  amount: number;
  initialPayment?: boolean;
  cancel?: boolean;
  cancelMessage?: string;
}

export interface IInvoice {
  seller?: Types.ObjectId;
  customer?: Types.ObjectId;
  premiseStore?: Types.ObjectId;
  isSeparate: boolean;
  prefix?: string;
  number?: number;
  prefixNumber: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: string;
  sellerName: string;
  expeditionDate: Date;
  expirationDate: Date;
  items: IInvoiceItem[];
  subtotal: number;
  discount?: number;
  amount: number;
  cash?: number;
  credit?: number;
  cashChange?: number;
  balance?: number;
  payments: IInvoicePayment[];
  cancel: boolean;
  cancelMessage?: string;
  christmasTicket?: number;
}

export type InvoiceDocumentProps = {
  items: Types.DocumentArray<IInvoiceItem>;
  payments: Types.DocumentArray<IInvoicePayment>;
};

export type InvoiceHydrated = HydratedDocument<IInvoice> & InvoiceDocumentProps;

export type OperationType =
  | 'sale'
  | 'purchase'
  | 'credit'
  | 'separate'
  | 'credit_payment'
  | 'separate_payment'
  | 'exchange';

export interface ISaleOperation {
  categories: Types.ObjectId[];
  tags: Types.ObjectId[];
  operationDate: Date;
  operationType: OperationType;
  description: string;
  amount: number;
}

export type HydratedSaleOperation = HydratedDocument<ISaleOperation>;
export type HydratedSaleOperationWithCategories = Omit<HydratedSaleOperation, 'categories'> & {
  categories: CategoryHydrated[];
};

// --------------------------------------------------------------------------------------
// REPORT
// --------------------------------------------------------------------------------------
export interface IDailyCreditEvolution {
  date: Date;
  credits: number;
  payments: number;
  balance: number;
}
