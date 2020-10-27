import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Types } from 'mongoose';

@Schema()
export class Cat extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({ index: true })
  template: Types.ObjectId;

  @Prop({ unique: true })
  alias: string

  @Prop()
  tv: []

}

export const CatSchema = SchemaFactory.createForClass(Cat);