import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { userStatusEnum } from '../enums/userActive.enum';
import { userRoleEnum } from '../enums/userRole.enum';

@Schema()
export class UserMeta extends Document{
  @Prop({
    enum: Object.values(userStatusEnum),
    default: userStatusEnum.pending,
    index: true
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
}
