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

import { userStatusEnum } from 'src/user/enums/userActive.enum';
import { UserWithTokenDto } from 'src/user/dto/userWithToken.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { User } from 'src/user/entities/user.entities';
import { RestorePasswordDto } from './dto/restorePassword.dto';
import { ReconfirmDto } from './dto/reconfirm.dto';
import { UserCreateDto } from 'src/user/dto/userCreate.dto';
import { userGenderEnum } from 'src/user/enums/userGender.enum';
import { userRoleEnum } from 'src/user/enums/userRole.enum';

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
    try {
      const id = await this.tokenService.verify(token);
      return await this.userService.activedUser(id); 
    } catch (error) {
      throw new BadRequestException(error.message);
    }    
  }

  async reconfirm(reconfirmDto: ReconfirmDto): Promise<void> {
    const user = await this.userService.getByEmail(reconfirmDto.email);

    if (this.userService.isActiveUser(user.meta.status)) {
      throw new BadRequestException('User is already confirmed');
    }

    if (this.userService.isBlockedUser(user.meta.status)) {
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
      console.log("-> userG", userGetted);
      const isAuth = await this.verifyPassword(
        password,
        userGetted.login.password,
      );
      console.log("-> isA", isAuth);
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

  async forgotPassword(forgotDto: ForgotPasswordDto): Promise<boolean> {
    const user: User = await this.userService.getByEmail(forgotDto.email);
    console.log("-> user", user);
    if (!user) {
      throw new BadRequestException('User not found from email');
    }
    if (user && user.meta.status !== userStatusEnum.active) {
      throw new BadRequestException('User not found confirmed profile');
    }
    const token = this.tokenService.create(user._id);
    const restoreLink = `${this.clientAppUrl}/auth/restorePassword?token=${token}`;
    console.log('-> restore pass', restoreLink);
    // TODO: Отправлять на почту ссылку
    return true;
  }

  //TODO проверить существует ли юзер
  async restorePassword(
    restorePasswordDto: RestorePasswordDto,
  ): Promise<boolean> {
    const id = this.tokenService.verify(restorePasswordDto.token);

    const randomPassword = genpass.generate({ length: 10, numbers: true });

    const randomPasswordHash = await this.userService.hashPassword(
      randomPassword,
    );

    const user = await this.userService.getOneById(id);
    if (!user) {
      throw new BadRequestException('User not found from email');
    }

    user.login.password = randomPasswordHash;

    // TODO: Отправлять на почту новый пароль
    console.log('-> new password', randomPassword);
    user.save();
    return true;
  }

  async changePassword(userId: string, password: string): Promise<boolean> {
    return await this.userService.updatePassword(userId, password);
  }
}
