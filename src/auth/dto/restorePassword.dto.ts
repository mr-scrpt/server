import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from 'src/token/dto/token.dto';

export class RestorePasswordDto extends TokenDto {}
