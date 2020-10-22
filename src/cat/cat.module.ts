import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpersService } from 'src/helpers/helpers.service';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { Cat, CatSchema } from './entities/cat.entities';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Cat.name,
        schema: CatSchema 
      }
    ])
  ],
  controllers: [CatController],
  providers: [CatService, HelpersService]
})
export class CatModule {}
