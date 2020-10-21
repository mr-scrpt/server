import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatCreateDto } from './dto/catCreate.dto';
import { CatIdDto } from './dto/catId.dto';
import { CatRenameDto } from './dto/catRename.dto';
import { Cat } from './entities/cat.entities';
import { HelpersService } from 'src/helpers/helpers.service';
import { CatDto } from './dto/cat.dto';
import { CatUniqueDto } from './dto/catUnique.dto';
import { CatTplDto } from './dto/catTpl.dto';

@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<Cat>,
    @Inject(HelpersService) private readonly helpersService: HelpersService
    
    ){}
  async catCreate(catCreateDto: CatCreateDto): Promise<CatCreateDto>{    
    try {
      const alias = this.helpersService.aliasGenerator(catCreateDto.name);

      await this.isUniqueCat({
        name: catCreateDto.name,
        alias
      });
      
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

  async catGetOne(catId: CatIdDto): Promise<Cat>{
    try {
      return await this.catModel.findById(catId.id);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async catGetAll():Promise<Cat[]>{
    try {
      return await this.catModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  async catGetWhereTpl(catTplDto: CatTplDto):Promise<Cat[]>{
    try {
      return await this.catModel.find({template: catTplDto.template}).exec();
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async catRename(catRenameDto: CatRenameDto): Promise<CatCreateDto>{
    try {

      const alias = this.helpersService.aliasGenerator(catRenameDto.newName);
      
      await this.isUniqueCat({
        name: catRenameDto.newName,
        alias
      });

      const cat = await this.catGetOne(catRenameDto);
      cat.name = catRenameDto.newName;
      cat.alias = alias;
      cat.save();      
      return cat.toObject();
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  } 

  async delete(catIdDto: CatIdDto): Promise<Cat>{
    try {
      const cat = await this.catGetOne(catIdDto);
      console.log("-> cat", cat);
      if(!cat){
        throw new NotFoundException('Categorie not found');
      }
      this.catModel.deleteOne({_id: catIdDto.id}).exec()
      return cat;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  private async isUniqueCat(catUniqueDto: CatUniqueDto): Promise<boolean> {
    const catName = await this.catModel.findOne({
      'name': catUniqueDto.name,
    });

    if(catName){
      throw new ConflictException('Duplicate categories name data');
    }
   
    const catAlias = await this.catModel.findOne({
      'alias': catUniqueDto.alias,
    });
    if(catAlias){
      throw new ConflictException('Duplicate categories alias data');
    }

    return true;
  }
}
