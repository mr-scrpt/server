import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateRenameDto {
  @ApiProperty() 
  @IsString()
  @IsNotEmpty()  
  readonly id: string;  

  @ApiProperty() 
  @IsString()
  @IsNotEmpty()  
  readonly newName: string; 
}
