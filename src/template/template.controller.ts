import { Body, Controller, Delete, Get, Patch, Post, ValidationPipe } from '@nestjs/common';
import { template } from 'lodash';
import { TemplateDto } from './dto/template.dto';
import { TemplateIdDto } from './dto/templateId.dto';
import { TemplateRenameDto } from './dto/templateRename.dto';
import { Template } from './entities/template.entities';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService){}

  @Post('/create')
  async create(
    @Body(new ValidationPipe()) templateDto: TemplateDto
  ): Promise<Template>{
    return await this.templateService.tplCreate(templateDto);
  }

  @Post('/getOneById')
  async getOneById(
    @Body(new ValidationPipe()) templateIdDto: TemplateIdDto
  ): Promise<Template>{
    return await this.templateService.tplGetOne(templateIdDto);
  }

  @Get('/getAll')
  async getAll(): Promise<Template[]>{
    return await this.templateService.tplGetAll();
  }
  
  @Patch('/rename')
  async rename(
    @Body(new ValidationPipe()) templateRenameDto: TemplateRenameDto
  ): Promise<Template>{
    return this.templateService.tplRename(templateRenameDto);
  }
  
  @Delete('/delete')
  async delete(
    @Body(new ValidationPipe()) templateIdDto: TemplateIdDto
  ){
    return this.templateService.tplDelete(templateIdDto);
  }  
}
