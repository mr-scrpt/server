import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { UserIdDto } from 'src/user/dto/userIdDto';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserIdDto => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  },
);
