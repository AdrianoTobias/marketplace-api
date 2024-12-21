import { Module } from '@nestjs/common'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-categories.controller'
import { FetchRecentProductsController } from './controllers/fetch-recent-products.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
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
export class httpModule {}
