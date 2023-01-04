import { removeNonPhoneChars } from 'src/utils';
import { CreateCustomerPhoneDto } from '../dto/create-customer-phone.dto';

export const normalizeCustomerPhones = (
  phones?: CreateCustomerPhoneDto[]
): CreateCustomerPhoneDto[] => {
  if (!phones) return [];

  return phones.map((phone) => {
    const number = removeNonPhoneChars(phone.number);
    return { ...phone, number };
  });
};
