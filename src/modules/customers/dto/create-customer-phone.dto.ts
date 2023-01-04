import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomerPhoneDto {
  @ApiProperty({ required: true, example: '555-555-5555' })
  @MaxLength(20, { message: 'No puede tener mas de 20 caracteres.' })
  @IsString({ message: 'El numero debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El numero es requerido.' })
  number: string;

  @ApiProperty({ required: false, example: 'Personal Phone' })
  @MaxLength(20, { message: 'Utiliza un maximo de 20 caracteres.' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: true })
  @IsBoolean({ message: 'Debe ser un booleano' })
  @IsOptional()
  whatsapp?: boolean;
}
