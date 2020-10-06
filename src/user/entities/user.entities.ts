import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';

import { Document } from 'mongoose';
import { userStatusEnum } from '../enums/userActive.enum';
import { userGenderEnum } from '../enums/userGender.enum';
import { userRoleEnum } from '../enums/userRole.enum';

@Schema()
@Exclude()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ default: '' })
  lastname: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({
    enum: Object.values(userGenderEnum),
  })
  gender: userGenderEnum;

  @Prop({
    enum: Object.values(userStatusEnum),
    default: userStatusEnum.pending,
  })
  status: userStatusEnum;

  @Prop({
    default: Date.now(),
  })
  registerAt: Date;

  @Prop({
    enum: Object.values(userRoleEnum),
    default: userRoleEnum.user,
  })
  role: userRoleEnum;

  // TODO Почитать про декоратор
  @Prop({ select: false })
  password: string;

  //TODO добавить поля адреса для доставки
  //TODO добавить поля даты рождения - можно поздравлять и предлагать товары, акции
  //TODO Увлечения для персональных рассылок
}

export const UserSchema = SchemaFactory.createForClass(User);
/* UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}; */
