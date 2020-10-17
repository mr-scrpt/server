import {
  BadRequestException,
  ConflictException,
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
import { RegistrationDto } from 'src/auth/dto/registration.dto';
import { userRoleEnum } from './enums/userRole.enum';
import { userGenderEnum } from './enums/userGender.enum';
import { UserUniqueDto } from './dto/userUnique.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getOneById(id: string): Promise<User> {
    try {
      
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
      return await this.userModel.findOne({ "login.email":email }).exec();
      
    } catch (error) {
      throw new BadRequestException('User not found by email');
    }
  }

  async create(registrationDto: RegistrationDto): Promise<UserSerializedDto> {
    try {
      // проверка уникальности данных      
      await this.isUniqueUser({
        email: registrationDto.email,
        phone: registrationDto.phone,
      });
      

      const hashedPassword = await hash(registrationDto.password, 10);
      const registerUser: UserCreateDto = {
        general: {
          name: registrationDto.name,
          lastname: registrationDto.lastname || '',
          gender: userGenderEnum.noSelected,
        },
        contacts: {
          email: registrationDto.email,
          phone: registrationDto.phone,
        },
        meta: {
          registerAt: new Date(),
          role: userRoleEnum.user,
          status: userStatusEnum.pending,
        },
        login: {
          password: hashedPassword,
          email: registrationDto.email,
        },
      };

      const userCreated = await new this.userModel(registerUser);
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

      user.login.password = await this.hashPassword(password);
      user.markModified('login.password');
      user.save();
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async activedUser(id): Promise<UserSerializedDto>{ 
    try {
      const user = await this.getOneById(id); 
      if (this.isActiveUser(user.meta.status)) {
        throw new BadRequestException('User is already confirmed');
      }
      if (this.isBlockedUser(user.meta.status)) {
        throw new BadRequestException('User is blocked');
      }
      if (this.isPendingUser(user.meta.status)) {
        user.meta.status = userStatusEnum.active;     
        user.markModified('meta.status'); // До сохранения отмечаем что внутренне поле изменено, инчаче юзер не сохранится 
        await user.save();
        return this.userSerialized(user.toObject());  
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
   
     
     
    /* try {
      await this.userModel.updateOne({_id: id}, { "meta.status": status}).exec()
    } catch (error) {
      throw new BadRequestException(error.message);
    }  */
    
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

  async isUniqueUser(userUniqueDto: UserUniqueDto): Promise<boolean> {
    const userEmail = await this.userModel.findOne({
      'contacts.email': userUniqueDto.email,
    });

    if(userEmail){
      throw new ConflictException('Duplicate email user data');
    }
   
    const userPhone = await this.userModel.findOne({
      'contacts.phone': userUniqueDto.phone,
    });
    if(userPhone){
      throw new ConflictException('Duplicate phone user data');
    }

    return true;
  }
  
}
