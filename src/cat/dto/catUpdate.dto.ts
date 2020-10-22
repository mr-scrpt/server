import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CatCreateDto } from './catCreate.dto';

export class CatUpdateDto extends PartialType(CatCreateDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

}
