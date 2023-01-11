import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCashboxDto {
  @ApiProperty({ required: true, example: 'Main Box' })
  @MaxLength(45, { message: 'Debe tener un maximo de 45 caracteres' })
  @MinLength(3, { message: 'Debe tener minimo 3 caracteres' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    type: [String],
    description: 'User IDs that can see the box',
  })
  @IsString({ each: true })
  @IsOptional()
  userIds?: string[];
}
