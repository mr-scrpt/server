import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema()
export class Template extends Document {
  @Prop({unique: true})
  name: string;

  @Prop()
  fields: string;  
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
