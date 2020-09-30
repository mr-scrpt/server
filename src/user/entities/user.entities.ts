import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { userStatusEnum } from '../enums/user-active.enum';
import { userRoleEnum } from '../enums/user-role.enum';

@Schema()
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

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
