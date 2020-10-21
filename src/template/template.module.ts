import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './entities/template.entities';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Template.name,
        schema: TemplateSchema
      }
    ])
  ],
  providers: [TemplateService],
  controllers: [TemplateController]
})
export class TemplateModule {}
