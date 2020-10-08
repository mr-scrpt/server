import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';
import * as _ from 'lodash';

import { UserCreateDto } from './dto/userCreate.dto';
import { User } from './entities/user.entities';
import { UserSerializedDto } from './dto/userSerialized.dto';
import { userStatusEnum } from './enums/userActive.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getOneById(id: string): Promise<User> {
    try {
      console.log('->  id', id);
      const res = await this.userModel.findById({ _id: id }).exec();
      if (!res) {
        throw new Error('User Not Found!');
      }
      return res;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Users not found');
    }
  }

  // TODO не нужне трайкетч, если юзера не находит то возвращает null а не ошибку - проверить везеде
  async getByEmail(email: string): Promise<User> {
    try {
      //Получаем только поле пароля
      return await this.userModel.findOne({ email }, 'password').exec();
    } catch (error) {
      throw new BadRequestException('User not found by email');
    }
  }

  async create(createUserDto: UserCreateDto): Promise<UserSerializedDto> {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      const userCreated = await new this.userModel(
        _.assignIn(createUserDto, { password: hashedPassword }),
      );

      const userSaved = await userCreated.save();

      const userCreatedSerialized = this.userSerialized(userSaved.toObject());
      return userCreatedSerialized;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  userSerialized(user): UserSerializedDto {
    const { password, ...userCreatedSerialized } = user;
    return userCreatedSerialized;
  }

  async updatePassword(userId: string, password: string): Promise<boolean> {
    try {
      //const res = await this.userModel.updateOne({ _id: userId }, password);

      const user = await this.getOneById(userId);

      user.password = await this.hashPassword(password);
      user.save();
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  isActiveUser(userStatus: userStatusEnum): boolean {
    if (userStatus === userStatusEnum.active) {
      return true;
    }
    return false;
  }
  isPendingUser(userStatus: userStatusEnum): boolean {
    if (userStatus === userStatusEnum.pending) {
      return true;
    }
    return false;
  }

  isBlockedUser(userStatus: userStatusEnum): boolean {
    if (userStatus === userStatusEnum.blocked) {
      return true;
    }
    return false;
  }
  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
