import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { CashboxsService } from './cashboxs.service';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';

@Controller('cashboxs')
@ApiTags('Cashboxs')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: 'Only user with the permissions can acces to this end points.',
})
export class CashboxsController {
  constructor(private readonly cashboxsService: CashboxsService) {}

  @Post()
  create(@Body() createCashboxDto: CreateCashboxDto) {
    return this.cashboxsService.create(createCashboxDto);
  }

  @Get()
  findAll() {
    return this.cashboxsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashboxsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCashboxDto: UpdateCashboxDto) {
    return this.cashboxsService.update(+id, updateCashboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashboxsService.remove(+id);
  }
}