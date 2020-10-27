import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { constant } from 'lodash';
import { Model } from 'mongoose';
import { TemplateDto } from './dto/template.dto';
import { TemplateIdDto } from './dto/templateId.dto';
import { TemplateRenameDto } from './dto/templateRename.dto';
import { Template } from './entities/template.entities';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>
  ) { }

  async tplCreate(templateDto: TemplateDto): Promise<Template> {
    try {
      await this.isUniqueTpl(templateDto);
      const tpl = new this.templateModel(templateDto);
      return tpl.save();

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async tplGetOne(templateIdDto: TemplateIdDto): Promise<Template> {
    try {
      return await this.templateModel.findById(templateIdDto.id);

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  async tplGetAll(): Promise<Template[]> {
    try {
      return await this.templateModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  async tplRename(templateRenameDto: TemplateRenameDto): Promise<Template> {
    try {
      await this.isUniqueTpl({ name: templateRenameDto.newName });
      const tpl = await this.tplGetOne(templateRenameDto)
      tpl.name = templateRenameDto.newName;
      tpl.save()
      return tpl.toObject()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async tplDelete(templateIdDto: TemplateIdDto): Promise<Template> {
    try {
      const tpl = await this.tplGetOne(templateIdDto);
      if (!tpl) {
        throw new NotFoundException('Tpl not found')
      }
      this.templateModel.deleteOne({ _id: templateIdDto.id }).exec()
      return tpl;

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async tplCheck(templateIdDto: TemplateIdDto) {
    try {
      await this.tplGetOne(templateIdDto);
      /* if (!exists) {
        throw new NotFoundException('Tpl is not found');
      } */
    } catch (error) {

      throw new BadRequestException(error.message)
    }
  }
  private async isUniqueTpl(templateDto: TemplateDto): Promise<boolean> {
    const tpl = await this.templateModel.findOne({ name: templateDto.name })

    if (tpl) {
      throw new ConflictException('Duplicate tpl name');
    }
    return true;
  }
}
