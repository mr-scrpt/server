import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { TokenDto } from 'src/token/dto/token.dto';

export const GetToken = createParamDecorator(
  (data: string, ctx: ExecutionContext): TokenDto => {
    const request = ctx.switchToHttp().getRequest();
    const token: string = request.headers.authorization.slice(7);

    if (!token) {
      throw new BadRequestException('Token not found');
    }
    return { token };
  },
);
