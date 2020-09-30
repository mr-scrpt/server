import { IsDateString, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  readonly uId: string;

  @IsDateString()
  readonly expireAt: string;
}
