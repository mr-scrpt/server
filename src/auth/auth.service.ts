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
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { User } from 'src/user/entities/user.entities';
import { RestorePasswordDto } from './dto/restorePassword.dto';
import { ReconfirmDto } from './dto/reconfirm.dto';

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

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await compare(plainTextPassword, hashedPassword);
    } catch (err) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async registration(
    registrationDto: RegistrationDto,
  ): Promise<UserSerializedDto> {
    const user = await this.userService.create(registrationDto);
    await this.confirmationSendLink(user);
    return user;
  }

  //TODO сделать отправку на почту ссылки для подтверждения
  async confirmationSendLink(
    userSerializedDto: UserSerializedDto,
  ): Promise<void> {
    const token = this.tokenService.create(userSerializedDto._id, '1h');
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;
    console.log('-> confirmLink', confirmLink);
  }

  async confirm(token: string): Promise<UserSerializedDto> {
    const id = await this.tokenService.verify(token);
    const user = await this.userService.getById(id);

    if (this.userService.isActiveUser(user.status)) {
      throw new BadRequestException('User is already confirmed');
    }

    if (this.userService.isBlockedUser(user.status)) {
      throw new BadRequestException('User is blocked');
    }

    if (this.userService.isPendingUser(user.status)) {
      user.status = userStatusEnum.active;
      user.save();
      return this.userService.userSerialized(user.toObject());
    }

    throw new BadRequestException('Confirmation error');
  }

  async reconfirm(reconfirmDto: ReconfirmDto): Promise<void> {
    const user = await this.userService.getByEmail(reconfirmDto.email);

    if (this.userService.isActiveUser(user.status)) {
      throw new BadRequestException('User is already confirmed');
    }

    if (this.userService.isBlockedUser(user.status)) {
      throw new BadRequestException('User is blocked');
    }

    this.confirmationSendLink(user._id);
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

  async forgotPassword(forgotDto: ForgotPasswordDto): Promise<void> {
    const user: User = await this.userService.getByEmail(forgotDto.email);

    if (!user) {
      throw new BadRequestException('User not found from email');
    }
    if (user && user.status !== userStatusEnum.active) {
      throw new BadRequestException('User not found confirmed profile');
    }
    const token = this.tokenService.create(user._id);
    const restoreLink = `${this.clientAppUrl}/auth/restorePassword?token=${token}`;
    console.log('-> restore pass', restoreLink);
    // TODO: Отправлять на почту ссылку
  }

  async restorePassword(restorePasswordDto: RestorePasswordDto): Promise<void> {
    const id = this.tokenService.verify(restorePasswordDto.token);

    const randomPassword = genpass.generate({ length: 10, numbers: true });

    const randomPasswordHash = await this.hashPassword(randomPassword);

    const user = await this.userService.getById(id);

    user.password = randomPasswordHash;

    // TODO: Отправлять на почту новый пароль
    user.save();

    if (!user) {
      throw new BadRequestException('User not found from email');
    }
  }

  async changePassword(userId: string, password: string): Promise<boolean> {
    //TODO вынести метод по хешированию отдельно
    const newPassword = await this.hashPassword(password);
    return await this.userService.update(userId, {
      password: newPassword,
    });
  }
}
