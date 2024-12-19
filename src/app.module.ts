import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { CreateCategoryController } from './controllers/create-category.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-categories.controller'
import { FetchRecentProductsController } from './controllers/fetch-recent-products.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryController,
    CreateProductController,
    FetchRecentQuestionsController,
    FetchRecentProductsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
