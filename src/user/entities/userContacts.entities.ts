import { Prop } from '@nestjs/mongoose';

export class UserContacts {
  @Prop({ unique: true, index: true })
  email: string;

  @Prop({ unique: true, index: true })
  phone: string;
}
