import { Body, Controller, Delete, Get, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatCreateDto } from './dto/catCreate.dto';
import { CatIdDto } from './dto/catId.dto';
import { CatRenameDto } from './dto/catRename.dto';
import { CatTplDto } from './dto/catTpl.dto';
import { Cat } from './entities/cat.entities';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService){}

  @Post('/create')
  async catCreate(
    @Body(new ValidationPipe()) catCreateDto: CatCreateDto
  ): Promise<CatCreateDto>{
    return await this.catService.catCreate(catCreateDto)
  }

  @Get('/getAll')
  async getAll(){    
    return await this.catService.catGetAll();
  }

  @Post('/getOneById')
  async getOneById(
    @Body(new ValidationPipe()) catIdDto: CatIdDto
  ){    
    return await this.catService.catGetOne(catIdDto);
  }

  @Post('/getWhereTpl')
  async getWheteTpl(
    @Body(new ValidationPipe()) catTplDto: CatTplDto
  ){    
    return await this.catService.catGetWhereTpl(catTplDto)
  }


  @Patch('/rename')
  async catRename(
    @Body(new ValidationPipe()) catRenameDto: CatRenameDto
  ): Promise<CatCreateDto>{
    return await this.catService.catRename(catRenameDto)
  }

  @Delete('/delete')
  async delete(
    @Body(new ValidationPipe()) catIdDto: CatIdDto
  ):Promise<Cat>{
    return await this.catService.delete(catIdDto)
  }

  /* @Post('/changeTpl')
  async catChangeTpl(
    @Body(new ValidationPipe()) catCreateDto: CatCreateDto
  ): Promise<CatCreateDto>{
    return await this.catService.catCreate(catCreateDto)
  }

  @Delete('/delete')
  async catDelete(
    @Body(new ValidationPipe()) catCreateDto: CatCreateDto
  ): Promise<CatCreateDto>{
    return await this.catService.catCreate(catCreateDto)
  } */
}
