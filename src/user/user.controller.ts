import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserIdDto } from './dto/userId.dto';
import { User } from './entities/user.entities';

import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getOneById')
  async getOneById(
    @Query(new ValidationPipe()) query: UserIdDto,
  ): Promise<User> {
    return await this.userService.getOneById(query._id);
  }

  @Get('/getAll')
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }
}
