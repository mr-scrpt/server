import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entities';
import { UserIdDto } from 'src/user/dto/userId.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  //Вызовится автоматически паспортом и в качестве пейлоада передастася расшифрованый токен в JSON
  async validate(payload: any): Promise<UserIdDto> {
    const user = { _id: payload.id };
    return user;
  }

  /*  async validate(req, user: Partial<User>) {
    //const token = req.header.authorization.slice(7);
    
    if (token) {
      return user;
    } else {
      throw new UnauthorizedException();
    }  
  } */
}
