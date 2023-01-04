import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { removeNonNumericChars } from 'src/utils';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Customer.name,
        useFactory: () => {
          const schema = CustomerSchema;

          schema.pre('validate', function preValidate() {
            const document = this.documentNumber;
            if (document && (this.isModified('documentNumber') || this.isNew)) {
              this.documentNumber = removeNonNumericChars(document);
            }
          });

          schema.virtual('fullName').get(function () {
            return `${this.firstName} ${this.lastName || ''}`.trim();
          });

          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
