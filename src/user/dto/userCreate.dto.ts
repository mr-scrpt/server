import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  Matches,
  IsEnum,
} from 'class-validator';
import { userGenderEnum } from '../enums/userGender.enum';

export class UserCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('ua')
  readonly phone: string;

  @ApiProperty()
  @IsNotEmpty()
  //@IsString()
  @IsEnum(userGenderEnum)
  readonly gender: userGenderEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly password: string;
}
