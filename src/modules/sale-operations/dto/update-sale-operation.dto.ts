import { PartialType } from '@nestjs/swagger';
import { CreateSaleOperationDto } from './create-sale-operation.dto';

export class UpdateSaleOperationDto extends PartialType(
  CreateSaleOperationDto
) {}
