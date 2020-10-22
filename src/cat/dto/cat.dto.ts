import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CatCreateDto } from './catCreate.dto';

export class CatDto extends CatCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly alias: string;


}
