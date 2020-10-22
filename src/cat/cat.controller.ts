import { Body, Controller, Delete, Get, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatCreateDto } from './dto/catCreate.dto';
import { CatIdDto } from './dto/catId.dto';
import { CatUpdateDto } from './dto/catUpdate.dto';
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
  async getAll():Promise<Cat[]>{    
    return await this.catService.catGetAll();
  }

  @Post('/getOneById')
  async getOneById(
    @Body(new ValidationPipe()) catIdDto: CatIdDto
  ):Promise<Cat>{    
    return await this.catService.catGetOne(catIdDto);
  }

  @Post('/getWhereTpl')
  async getWheteTpl(
    @Body(new ValidationPipe()) catTplDto: CatTplDto
  ):Promise<Cat[]>{    
    return await this.catService.catGetWhereTpl(catTplDto)
  }


  @Patch('/update')
  async catRename(
    @Body(new ValidationPipe()) catUpdateDto: CatUpdateDto
  ): Promise<CatCreateDto>{
    return await this.catService.catUpdate(catUpdateDto)
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

  */
}
