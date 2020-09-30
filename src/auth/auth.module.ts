import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entities';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { TokenService } from 'src/token/token.service';
import { TokenModule } from 'src/token/token.module';
import { JwtStrategy } from './jwt.starategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TokenModule,
  ],
  providers: [AuthService, UserService, TokenService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
