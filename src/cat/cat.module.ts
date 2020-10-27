import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpersService } from 'src/common/helpers/helpers.service';
import { TemplateModule } from 'src/template/template.module';
import { TemplateService } from 'src/template/template.service';
import { UserModule } from 'src/user/user.module';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { Cat, CatSchema } from './entities/cat.entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cat.name,
        schema: CatSchema
      }
    ]),
    TemplateModule,
    UserModule
  ],
  controllers: [CatController],
  providers: [CatService, HelpersService]
})
export class CatModule { }
