import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CatDto } from './cat.dto';

export class CatUpdateDto extends PartialType(CatDto){
  @ApiProperty() 
  @IsString()
  @IsNotEmpty()
  readonly id: string;  
}
