import { Module } from '@nestjs/common'

import { AuthenticateSellerController } from './controllers/authenticate-seller.controller'
import { RegisterSellerController } from './controllers/register-seller.controller'
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
import { GetSellerProfileController } from './controllers/get-seller-profile.controller'
import { GetSellerProfileUseCase } from '@/domain/marketplace/application/use-cases/get-seller-profile'
import { EditSellerController } from './controllers/edit-seller.controller'
import { EditSellerUseCase } from '@/domain/marketplace/application/use-cases/edit-seller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterSellerController,
    EditSellerController,
    GetSellerProfileController,
    AuthenticateSellerController,
    CreateCategoryController,
    CreateProductController,
    FetchRecentQuestionsController,
    FetchRecentProductsController,
  ],
  providers: [
    RegisterSellerUseCase,
    EditSellerUseCase,
    GetSellerProfileUseCase,
    CreateCategoryUseCase,
    FetchAllCategoriesUseCase,
    AuthenticateSellerUseCase,
  ],
})
export class httpModule {}
