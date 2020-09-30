import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserSerializedDto } from 'src/user/dto/userSerialized.dto';

import { AuthService } from './auth.service';
import { ConfirmAccountDto } from './dto/confirmAccount.dto';
import { ForgotPasswordDto } from './dto/forgotPasswordDto.dto';
import { LoginDto } from './dto/login.dto';
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

  @Post('/forgotPassword')
  async forgotPassword(
    @Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('/restorePassword')
  async restorePassword(
    @Query(new ValidationPipe()) restorePasswordDto: RestorePasswordDto,
  ): Promise<void> {
    await this.authService.restorePassword(restorePasswordDto);
  }
}
