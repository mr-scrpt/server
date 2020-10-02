import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly _id: string;
}
