import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CatCreateDto } from './catCreate.dto';

export class CatDto extends CatCreateDto {  
  @IsString()
  @IsNotEmpty()
  readonly alias: string;
}
