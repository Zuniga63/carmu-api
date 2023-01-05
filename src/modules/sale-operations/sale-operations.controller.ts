import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SaleOperationsService } from './sale-operations.service';
import { CreateSaleOperationDto } from './dto/create-sale-operation.dto';
import { UpdateSaleOperationDto } from './dto/update-sale-operation.dto';

@Controller('sale-operations')
export class SaleOperationsController {
  constructor(private readonly saleOperationsService: SaleOperationsService) {}

  @Post()
  create(@Body() createSaleOperationDto: CreateSaleOperationDto) {
    return this.saleOperationsService.create(createSaleOperationDto);
  }

  @Get()
  findAll() {
    return this.saleOperationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleOperationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleOperationDto: UpdateSaleOperationDto
  ) {
    return this.saleOperationsService.update(+id, updateSaleOperationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleOperationsService.remove(+id);
  }
}
