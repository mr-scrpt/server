// App Modules
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
// DB
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { TokenModule } from './token/token.module';
import { configRoot } from './config.root';
import { CatModule } from './cat/cat.module';
import { TemplateModule } from './template/template.module';
import { HelpersModule } from './helpers/helpers.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    configRoot,
    UserModule,
    MongooseModule.forRoot(
      `${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      {
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
      },
    ),
    AuthModule,
    TokenModule,
    CatModule,
    TemplateModule,
    HelpersModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
