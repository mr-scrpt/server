import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';

import { Document } from 'mongoose';
import { userStatusEnum } from '../enums/user-active.enum';
import { userRoleEnum } from '../enums/user-role.enum';

@Schema()
@Exclude()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ default: '' })
  @Expose()
  lastname: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({
    enum: Object.values(userStatusEnum),
    default: userStatusEnum.pending,
  })
  status: userStatusEnum;

  @Prop({
    default: Date.now(),
  })
  @Expose()
  registerAt: Date;

  @Prop({
    enum: Object.values(userRoleEnum),
    default: userRoleEnum.user,
  })
  role: userRoleEnum;

  // TODO Почитать про декоратор
  @Prop()
  @Expose()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};
