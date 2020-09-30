import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestorePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
