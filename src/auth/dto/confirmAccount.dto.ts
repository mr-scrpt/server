import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
