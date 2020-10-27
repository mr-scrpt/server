import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { CatCreateDto } from './catCreate.dto';

export class CatUpdateDto extends PartialType(CatCreateDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: Types.ObjectId;

}
