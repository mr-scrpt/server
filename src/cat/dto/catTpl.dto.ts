import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CatTplDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly template: Types.ObjectId;

}
