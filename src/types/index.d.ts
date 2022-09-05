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
  cashier: Types.ObjectId;
  users: Types.ObjectId[];
  name: string;
  base: number;
  boxOpen?: Date;
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

export interface IMonetaryValue {
  denomination: string;
  value: number;
  count: number;
}

export interface CashClosingRecord {
  cashbox?: Types.ObjectId;
  user?: Types.ObjectId;
  cashier?: Types.ObjectId;
  userName: string;
  cashierName: string;
  closingDate: Date;
  base: number;
  newBase: number;
  incomes?: number;
  expenses?: number;
  coins?: IMonetaryValue[];
  bills?: IMonetaryValue[];
  leftover?: number;
  missing?: number;
  observation?: string;
}
