import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class TemplateRenameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly newName: string;
}
