import { Injectable } from '@nestjs/common';
import { CreateSaleOperationDto } from './dto/create-sale-operation.dto';
import { UpdateSaleOperationDto } from './dto/update-sale-operation.dto';

@Injectable()
export class SaleOperationsService {
  create(createSaleOperationDto: CreateSaleOperationDto) {
    return 'This action adds a new saleOperation';
  }

  findAll() {
    return `This action returns all saleOperations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saleOperation`;
  }

  update(id: number, updateSaleOperationDto: UpdateSaleOperationDto) {
    return `This action updates a #${id} saleOperation`;
  }

  remove(id: number) {
    return `This action removes a #${id} saleOperation`;
  }
}
