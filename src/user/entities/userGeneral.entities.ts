import { Prop } from '@nestjs/mongoose';
import { userGenderEnum } from '../enums/userGender.enum';

export class UserGeneral {
  @Prop()
  name: string;

  @Prop({ default: '' })
  lastname: string;

  @Prop({
    enum: Object.values(userGenderEnum),
  })
  gender: userGenderEnum;
}
