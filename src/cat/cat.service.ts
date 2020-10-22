import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatCreateDto } from './dto/catCreate.dto';
import { CatIdDto } from './dto/catId.dto';
import { CatUpdateDto } from './dto/catUpdate.dto';
import { Cat } from './entities/cat.entities';
import { HelpersService } from 'src/helpers/helpers.service';
import { CatDto } from './dto/cat.dto';
import { CatUniqueDto } from './dto/catUnique.dto';
import { CatTplDto } from './dto/catTpl.dto';
import { resolve } from 'path';
import { reject, values } from 'lodash';


@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<Cat>,
    @Inject(HelpersService) private readonly helpersService: HelpersService

  ) { }
  async catCreate(catCreateDto: CatCreateDto): Promise<CatCreateDto> {
    try {
      const alias = this.helpersService.aliasGenerator(catCreateDto.name);


      await this.helpersService.isUniqueField([
        { name: 'name', value: catCreateDto.name },
        { name: 'alias', value: alias },
      ], this.catModel)

      const catDto: CatDto = {
        ...catCreateDto,
        alias
      }
      const catCreated = await new this.catModel(catDto);
      return catCreated.save();
    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }

  async catGetOne(catId: CatIdDto): Promise<Cat> {
    try {
      return await this.catModel.findById(catId.id);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async catGetAll(): Promise<Cat[]> {
    try {
      return await this.catModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  async catGetWhereTpl(catTplDto: CatTplDto): Promise<Cat[]> {
    try {
      return await this.catModel.find({ template: catTplDto.template }).exec();
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async catUpdate(catUpdateDto: CatUpdateDto): Promise<CatCreateDto> {
    try {

      await this.helpersService.isUniqueField([
        { name: 'name', value: catUpdateDto.name }
      ], this.catModel)

      const alias = this.helpersService.aliasGenerator(catUpdateDto.name);

      const cat = await this.catGetOne(catUpdateDto);
      if (!cat) {
        throw new NotFoundException('Cat is not found')
      }

      cat.name = catUpdateDto.name;
      cat.alias = alias;
      cat.save();
      return cat.toObject();
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async delete(catIdDto: CatIdDto): Promise<Cat> {
    try {
      const cat = await this.catGetOne(catIdDto);
      console.log("-> cat", cat);
      if (!cat) {
        throw new NotFoundException('Categorie not found');
      }
      this.catModel.deleteOne({ _id: catIdDto.id }).exec()
      return cat;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }


  /* private async isUniqueField(fieldsToCheck: Array<UniqueFieldsType>): Promise<void> {

    await Promise.all(fieldsToCheck.map(async (item: UniqueFieldsType) => {
      const doc = await this.catModel.findOne({
        [item.name]: item.value
      })
      if (doc) {
        throw new ConflictException(`Duplicate "${item.name}" data`);
      }
    }))
  } */
}
