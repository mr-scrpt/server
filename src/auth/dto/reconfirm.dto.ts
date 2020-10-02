import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ReconfirmDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
