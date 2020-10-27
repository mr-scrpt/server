import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class TemplateIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: Types.ObjectId;

}
