import { Module } from '@nestjs/common'

import { AuthenticateSellerController } from './controllers/authenticate-seller.controller'
import { ResgisterSellerController } from './controllers/register-seller.controller'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-categories.controller'
import { FetchRecentProductsController } from './controllers/fetch-recent-products.controller'
import { CreateCategoryUseCase } from '@/domain/marketplace/application/use-cases/create-category'
import { DatabaseModule } from '../database/database-module'
import { FetchAllCategoriesUseCase } from '@/domain/marketplace/application/use-cases/fetch-all-categories'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterSellerUseCase } from '@/domain/marketplace/application/use-cases/register-seller'
import { AuthenticateSellerUseCase } from '@/domain/marketplace/application/use-cases/authenticate-seller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    ResgisterSellerController,
    AuthenticateSellerController,
    CreateCategoryController,
    CreateProductController,
    FetchRecentQuestionsController,
    FetchRecentProductsController,
  ],
  providers: [
    CreateCategoryUseCase,
    FetchAllCategoriesUseCase,
    RegisterSellerUseCase,
    AuthenticateSellerUseCase,
  ],
})
export class httpModule {}
