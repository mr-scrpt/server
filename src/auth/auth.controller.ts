import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/getUser.decorator';
import { UserIdDto } from 'src/user/dto/userIdDto';
import { UserSerializedDto } from 'src/user/dto/userSerialized.dto';
import { User } from 'src/user/entities/user.entities';

import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ConfirmAccountDto } from './dto/confirmAccount.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { LoginDto } from './dto/login.dto';
import { ReconfirmDto } from './dto/reconfirm.dto';
import { RegistrationDto } from './dto/registration.dto';
import { RestorePasswordDto } from './dto/restorePassword.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  async registration(
    @Body(new ValidationPipe()) registrationDto: RegistrationDto,
  ): Promise<UserSerializedDto> {
    return await this.authService.registration(registrationDto);
  }

  @Post('/login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ): Promise<UserSerializedDto> {
    return this.authService.login(loginDto);
  }

  @Get('/confirm')
  async confirm(
    @Query(new ValidationPipe()) query: ConfirmAccountDto,
  ): Promise<UserSerializedDto> {
    const user = await this.authService.confirm(query.token);
    return user;
  }

  // Если пользователь не успел подтвердить аккаунт, а срок действия токена истек, нужно перегенерировать подтверждение
  @Post('/reconfirm')
  async reconfirm(
    @Body(new ValidationPipe()) reconfirmDto: ReconfirmDto,
  ): Promise<void> {
    await this.authService.reconfirm(reconfirmDto);
  }

  //Пользователь забыл пароль(пользователь не залогинен)
  @Post('/forgotPassword')
  async forgotPassword(
    @Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto);
  }

  //Сброс пароля на автоматический пароль(пользователь не залогинен)
  @Get('/restorePassword')
  async restorePassword(
    @Query(new ValidationPipe()) restorePasswordDto: RestorePasswordDto,
  ): Promise<void> {
    console.log('-> in restore');
    await this.authService.restorePassword(restorePasswordDto);
  }
  //Изменение праролья (залогиненый пользователь)

  @Patch('/changePassword')
  @UseGuards(AuthGuard())
  async changePassword(
    @GetUser() userIdDto: UserIdDto,
    @Body(new ValidationPipe())
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    return await this.authService.changePassword(
      userIdDto._id,
      changePasswordDto.password,
    );
  }
}
