import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: false })
  @IsMongoId({ message: 'No es un ID válido' })
  @IsOptional({ message: 'El nombre es requerido.' })
  mainCategory?: string;

  @ApiProperty({ required: true, example: 'Main Category' })
  @MaxLength(45, { message: 'Nombre muy largo.' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  name: string;

  @ApiProperty({ required: false, example: 'This is a optiona description' })
  @MaxLength(255, { message: 'Descripción muy extensa.' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @IsOptional({ message: 'El nombre es requerido.' })
  description?: string;

  @ApiProperty({ required: true, example: true })
  @IsBoolean()
  isEnabled: boolean;
}
