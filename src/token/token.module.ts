import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.starategy';
import { configRoot } from 'src/config.root';
import { TokenService } from './token.service';

@Module({
  imports: [
    configRoot,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
