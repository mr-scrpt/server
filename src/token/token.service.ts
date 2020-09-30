import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { ConfirmAccountDto } from 'src/auth/dto/confirmAccount.dto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  create(id: string): string {
    return this.jwtService.sign({ id });
  }

  confirm(id: string): string {
    return this.jwtService.sign({ id }, { expiresIn: '1h' });
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
