import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserLogin extends Document {
  @Prop({ select: false })
  password: string;

  @Prop({ unique: true })
  email: string;
}
