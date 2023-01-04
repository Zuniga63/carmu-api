import { ApiProperty } from '@nestjs/swagger';

export class CustomerPhoneDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  @ApiProperty({ required: true, example: '555-555-5555' })
  number: string;

  @ApiProperty({ required: false, example: 'Personal Phone' })
  description?: string;

  @ApiProperty({ required: false, example: true })
  whatsapp?: boolean;
}
