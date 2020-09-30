import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

import * as genpass from 'generate-password';
import { compare, hash } from 'bcrypt';
import * as _ from 'lodash';
import { RegistrationDto } from './dto/registration.dto';

import { LoginDto } from './dto/login.dto';
import { TokenService } from 'src/token/token.service';
import { UserSerializedDto } from 'src/user/dto/userSerialized.dto';

import { userStatusEnum } from 'src/user/enums/user-active.enum';
import { UserWithTokenDto } from 'src/user/dto/userWithToken.dto';
import { ForgotPasswordDto } from './dto/forgotPasswordDto.dto';
import { User } from 'src/user/entities/user.entities';
import { RestorePasswordDto } from './dto/restorePassword.dto';

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(TokenService) private readonly tokenService: TokenService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
  }

  async registration(
    registrationDto: RegistrationDto,
  ): Promise<UserSerializedDto> {
    const user = await this.userService.create(registrationDto);
    await this.confirmationSendLink(user);
    return user;
  }

  //TODO сделать отправку на почту ссылки для подтверждения
  async confirmationSendLink(user: UserSerializedDto): Promise<void> {
    const token = this.tokenService.confirm(user._id);
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;
  }

  async confirm(token: string): Promise<UserSerializedDto> {
    const id = await this.tokenService.verify(token);
    const user = await this.userService.find(id);
    if (user && user.status === userStatusEnum.pending) {
      user.status = userStatusEnum.active;
      user.save();
      return this.userService.userSerialized(user.toObject());
    }
    throw new BadRequestException('Confirmation error');
  }

  async validateUser({
    email,
    password,
  }: LoginDto): Promise<UserSerializedDto> {
    try {
      const userGetted = await this.userService.getByEmail(email);
      const isAuth = await this.verifyPassword(password, userGetted.password);

      if (!isAuth) {
        throw new Error();
      }
      const userSerialized = this.userService.userSerialized(
        userGetted.toObject(),
      );
      return userSerialized;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized user');
    }
  }

  async login(loginDto: LoginDto): Promise<UserWithTokenDto> {
    const user = await this.validateUser(loginDto);

    const token = this.tokenService.create(user._id);

    const userWithToken = _.assignIn(user, { token });
    return userWithToken;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      console.log('-> here 2');
      return await compare(plainTextPassword, hashedPassword);
    } catch (err) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(forgotDto: ForgotPasswordDto): Promise<void> {
    const user: User = await this.userService.getByEmail(forgotDto.email);

    if (!user) {
      throw new BadRequestException('User not found from email');
    }

    const token = this.tokenService.create(user._id);
    const forgotLink = `${this.clientAppUrl}/auth/restorePassword?token=${token}`;
    // TODO: Отправлять на почту ссылку
    console.log('-> forgotLink', forgotLink);
  }

  async restorePassword(restorePasswordDto: RestorePasswordDto): Promise<void> {
    const id = this.tokenService.verify(restorePasswordDto.token);

    const randomPassword = genpass.generate({ length: 10, numbers: true });

    const randomPasswordHash = await hash(randomPassword, 10);

    const user = await this.userService.find(id);

    user.password = randomPasswordHash;

    // TODO: Отправлять на почту новый пароль
    user.save();

    if (!user) {
      throw new BadRequestException('User not found from email');
    }
  }
}
