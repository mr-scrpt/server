import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsDate } from 'class-validator';
import { userStatusEnum } from '../enums/userActive.enum';
import { userRoleEnum } from '../enums/userRole.enum';

export class UserMetaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(userStatusEnum)
  readonly status: userStatusEnum;

  @IsDate()
  @IsNotEmpty()
  readonly registerAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(userRoleEnum)
  readonly role: userRoleEnum;
}
