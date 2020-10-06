import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getAll')
  async getAll() {
    const test2 = await this.userService.getAll();
    console.log('-> test2', test2);
    return test2;
    /* const users = await this.userService.getAll();
    const usersResponse = users.map(user => user.toJSON());
    return usersResponse; */
  }
}
