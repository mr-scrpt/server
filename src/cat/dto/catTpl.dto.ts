import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CatTplDto {  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly template: string; 
  
}
