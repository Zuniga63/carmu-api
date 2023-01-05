import { Injectable } from '@nestjs/common';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';

@Injectable()
export class CashboxsService {
  create(createCashboxDto: CreateCashboxDto) {
    return 'This action adds a new cashbox';
  }

  findAll() {
    return `This action returns all cashboxs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cashbox`;
  }

  update(id: number, updateCashboxDto: UpdateCashboxDto) {
    return `This action updates a #${id} cashbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} cashbox`;
  }
}
