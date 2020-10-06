import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly _id: string;
}
