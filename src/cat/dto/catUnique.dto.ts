import { IsNotEmpty, IsString } from 'class-validator';

export class CatUniqueDto {  
  @IsString()
  @IsNotEmpty()
  readonly name: string; 

  
  @IsString()
  @IsNotEmpty()
  readonly alias: string; 
}
