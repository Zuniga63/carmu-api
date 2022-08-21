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

export type StoreCategoryRequest = Pick<ICategory, 'name' | 'description' | 'image'>;
export interface UpdateCategoryRequest extends Pick<ICategory, 'name' | 'description' | 'image'> {
  isEnabled?: string;
  order?: string;
}
