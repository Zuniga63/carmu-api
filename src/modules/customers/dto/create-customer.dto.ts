import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCustomerPhoneDto } from './create-customer-phone.dto';

export class CreateCustomerDto {
  @ApiProperty({ required: true, example: 'Jhon' })
  @MaxLength(90, { message: 'Nombre muy largo.' })
  @MinLength(3, { message: 'El nombre debe tener minimo 3 caracteres.' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  firstName: string;

  @ApiProperty({ example: 'Doe', required: false })
  @MaxLength(90, { message: 'Nombre muy largo.' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Mr. Doe', required: false })
  @MaxLength(45, { message: 'Alias muy largo.' })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiProperty({ required: false })
  @MaxLength(255, { message: 'Descripción muy extensa.' })
  @IsString()
  @IsOptional()
  observation?: string;

  @ApiProperty({ example: 'jhondoe@example.com', required: false })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'falsy street 1234', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '1.064.000.000', required: false })
  @IsString()
  @IsOptional()
  documentNumber: string;

  @ApiProperty({
    example: 'CC',
    required: false,
    enum: ['CC', 'TI', 'PAP', 'NIT'],
  })
  @IsEnum(['CC', 'TI', 'PAP', 'NIT'], {
    message: 'No es un tipo de documento válido.',
  })
  @ValidateIf((o) => Boolean(o.documentNumber))
  @IsOptional()
  documentType: string;

  @ApiProperty({ type: [CreateCustomerPhoneDto], required: true })
  @ValidateNested()
  @Type(() => CreateCustomerPhoneDto)
  @IsArray({ message: 'Debe ser un arreglo de teléfonos' })
  @IsNotEmpty({ message: 'El campo telefonos es requerido' })
  phones: CreateCustomerPhoneDto[];
}
