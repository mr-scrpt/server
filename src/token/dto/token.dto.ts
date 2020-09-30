import { IsString } from 'class-validator';
import { CreateTokenDto } from './createToken.dto';

export class TokenDto extends CreateTokenDto {
  @IsString()
  token: string;
}
