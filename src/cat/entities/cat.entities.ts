import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema()
export class Cat extends Document {
  @Prop({unique: true, index: true})
  name: string;

  @Prop({index: true})
  template: string;

  @Prop({unique: true})
  alias: string
  
}

export const CatSchema = SchemaFactory.createForClass(Cat);
