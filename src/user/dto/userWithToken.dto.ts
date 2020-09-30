import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserSerializedDto } from './userSerialized.dto';

export class UserWithTokenDto extends UserSerializedDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
