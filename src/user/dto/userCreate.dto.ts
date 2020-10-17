import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { userGenderEnum } from '../enums/userGender.enum';
import { UserContactsDto } from './userContacts.dto';
import { UserGeneralDto } from './userGeneral.dto';
import { UserLoginDto } from './userLogin.dto';
import { UserMetaDto } from './userMeta.dto';

export class UserCreateDto {
  @ApiProperty()
  @IsObject()
  general: UserGeneralDto;

  @ApiProperty()
  @IsObject()
  contacts: UserContactsDto;

  @ApiProperty()
  @IsObject()
  meta: UserMetaDto;

  @ApiProperty()
  @IsObject()
  login: UserLoginDto;

  /* @ApiProperty()
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
  readonly password: string; */
}
