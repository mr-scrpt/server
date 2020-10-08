import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { ConfirmAccountDto } from 'src/auth/dto/confirmAccount.dto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  create(id: string, expiresIn?: string): string {
    if (!expiresIn) {
      return this.jwtService.sign({ id });
    }
    return this.jwtService.sign({ id }, { expiresIn });
  }

  verify(token: string): string {
    try {
      const { id } = this.jwtService.verify(token);
      return id;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
