import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { removeNonNumericChars } from 'src/utils';
import { User, UserDocument } from '../users/schema/user.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { normalizeCustomerPhones } from './utils';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}
  async create(createCustomerDto: CreateCustomerDto) {
    const phones = normalizeCustomerPhones(createCustomerDto.phones);

    const customer = await this.customerModel.create({
      ...createCustomerDto,
      phones,
    });

    return customer;
  }

  /**
   * This action returns all customers
   * @returns
   */
  findAll() {
    return this.customerModel.find({}).sort('firstName').sort('lastName');
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id);
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const { firstName, phones, documentNumber, ...rest } = updateCustomerDto;
    const customer = await this.customerModel.findById(id);
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    customer.firstName = firstName || customer.firstName;
    customer.lastName = rest.lastName;
    customer.alias = rest.alias;
    customer.observation = rest.observation;
    customer.email = rest.email;
    customer.address = rest.address;
    customer.documentType = documentNumber
      ? rest.documentType || 'CC'
      : undefined;
    customer.documentNumber = documentNumber
      ? removeNonNumericChars(documentNumber)
      : documentNumber;
    customer.phones = normalizeCustomerPhones(phones) as any;

    await customer.save({ validateModifiedOnly: true });

    return customer;
  }

  async remove(id: string) {
    const customer = await this.customerModel.findByIdAndDelete(id);
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    if (customer.user && isValidObjectId(customer.user)) {
      await this.userModel.findByIdAndUpdate(customer.user, {
        customer: undefined,
      });
    }

    return customer;
  }
}
