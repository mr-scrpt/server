import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatCreateDto } from './dto/catCreate.dto';
import { CatIdDto } from './dto/catId.dto';
import { CatUpdateDto } from './dto/catUpdate.dto';
import { Cat } from './entities/cat.entities';
import { HelpersService } from 'src/common/helpers/helpers.service';
import { CatDto } from './dto/cat.dto';
import { CatTplDto } from './dto/catTpl.dto';
import { TemplateService } from 'src/template/template.service';


@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<Cat>,
    @Inject(HelpersService) private readonly helpersService: HelpersService,
    @Inject(TemplateService) private readonly templateService: TemplateService

  ) { }
  async catCreate(catCreateDto: CatCreateDto): Promise<CatCreateDto> {
    try {
      await this.templateService.tplCheck({ id: catCreateDto.template })
      const alias = this.helpersService.aliasGenerator(catCreateDto.name);

      await this.helpersService.isUniqueField([
        { name: 'name', value: catCreateDto.name },
        { name: 'alias', value: alias },
      ], this.catModel)

      const catDto: CatDto = {
        ...catCreateDto,
        alias,
        tv: []
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

  async catUpdate(catUpdateDto: CatUpdateDto): Promise<Cat> {
    try {
      await this.templateService.tplCheck({ id: catUpdateDto.template })
      let toUpdate = {};
      if (catUpdateDto.name) {

        await this.helpersService.isUniqueField([
          { name: 'name', value: catUpdateDto.name }
        ], this.catModel);
        const alias = this.helpersService.aliasGenerator(catUpdateDto.name);
        toUpdate = { ...catUpdateDto, alias }

      } else {
        toUpdate = { ...catUpdateDto }
      }

      const upd = this.catModel.findOneAndUpdate(
        { _id: catUpdateDto.id },
        { ...toUpdate },
        { new: true })
      return await upd.exec()


    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async delete(catIdDto: CatIdDto): Promise<Cat> {
    try {
      const cat = await this.catGetOne(catIdDto);
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
