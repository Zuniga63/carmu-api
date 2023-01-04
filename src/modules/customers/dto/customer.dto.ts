import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/dto/image.dto';
import { IImage } from 'src/utils';
import { CustomerPhoneDto } from './customer-phone.dto';

export class CustomerDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485', required: true })
  id: string;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485', required: false })
  user?: string;

  @ApiProperty({ example: 'Jhon', required: true })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Optional param',
    required: false,
  })
  lastName?: string;

  @ApiProperty({ example: 'Jhon Doe' })
  fullName: string;

  @ApiProperty({ type: ImageDto, required: false })
  profilePhoto?: IImage;

  @ApiProperty({ example: 'Mr. Doe', required: false })
  alias?: string;

  @ApiProperty({ example: 'This is a optional description', required: false })
  observation?: string;

  @ApiProperty({ example: 'jhondoe@example.com', required: false })
  email?: string;

  @ApiProperty({ example: 'falsy street 1234', required: false })
  address?: string;

  @ApiProperty({ example: '1.064.000.000', required: false })
  documentNumber: string;

  @ApiProperty({
    example: 'CC',
    required: false,
    enum: ['CC', 'TI', 'PAP', 'NIT'],
  })
  documentType: string;

  @ApiProperty({ type: [CustomerPhoneDto], required: true })
  phones: CustomerPhoneDto[];
}
