import { Module } from '@nestjs/common'

import { AuthenticateSellerController } from './controllers/authenticate-seller.controller'
import { RegisterSellerController } from './controllers/register-seller.controller'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { FetchAllCategoriesController } from './controllers/fetch-all-categories.controller'
import { FetchAllProductsController } from './controllers/fetch-all-products.controller'
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
import { CreateProductUseCase } from '@/domain/marketplace/application/use-cases/create-product'
import { EditProductUseCase } from '@/domain/marketplace/application/use-cases/edit-product'
import { EditProductController } from './controllers/edit-product.controller'
import { GetProductByIdUseCase } from '@/domain/marketplace/application/use-cases/get-product-by-id'
import { GetProductByIdController } from './controllers/get-product-by-id.controller'
import { ChangeProductStatusUseCase } from '@/domain/marketplace/application/use-cases/change-product-status'
import { ChangeProductStatusController } from './controllers/change-product-status.controller'
import { FetchProductsByOwnerIdUseCase } from '@/domain/marketplace/application/use-cases/fetch-products-by-owner'
import { FetchProductsByOwnerController } from './controllers/fetch-products-by-owner.controller'
import { FetchAllProductsUseCase } from '@/domain/marketplace/application/use-cases/fetch-all-products'
import { RegisterProductViewUseCase } from '@/domain/marketplace/application/use-cases/register-product-view'
import { RegisterProductViewController } from './controllers/register-product-view.controller'
import { CountSellerProductsUseCase } from '@/domain/marketplace/application/use-cases/count-seller-products'
import { CountProductsSoldBySellerInLast30DaysController } from './controllers/count-products-sold-by-seller-in-last-30-days.controller'
import { CountProductsAvailableBySellerInLast30DaysController } from './controllers/count-products-available-by-seller-in-last-30-days.controller'
import { CountSellerViewsBySellerInLast30DaysController } from './controllers/count-seller-views-in-last-30-days.controller'
import { CountSellerViewsUseCase } from '@/domain/marketplace/application/use-cases/count-seller-views'
import { CountSellerViewsPerDayUseCase } from '@/domain/marketplace/application/use-cases/count-seller-views-per-day'
import { CountSellerViewsPerDayBySellerInLast30DaysController } from './controllers/count-seller-views-per-day-in-last-30-days.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterSellerController,
    EditSellerController,
    GetSellerProfileController,
    CountProductsSoldBySellerInLast30DaysController,
    CountProductsAvailableBySellerInLast30DaysController,
    CountSellerViewsBySellerInLast30DaysController,
    CountSellerViewsPerDayBySellerInLast30DaysController,
    AuthenticateSellerController,
    CreateCategoryController,
    CreateProductController,
    FetchProductsByOwnerController,
    GetProductByIdController,
    EditProductController,
    ChangeProductStatusController,
    FetchAllCategoriesController,
    FetchAllProductsController,
    RegisterProductViewController,
  ],
  providers: [
    RegisterSellerUseCase,
    EditSellerUseCase,
    GetSellerProfileUseCase,
    CountSellerProductsUseCase,
    CountSellerViewsUseCase,
    CountSellerViewsPerDayUseCase,
    CreateCategoryUseCase,
    CreateProductUseCase,
    FetchAllProductsUseCase,
    FetchProductsByOwnerIdUseCase,
    GetProductByIdUseCase,
    EditProductUseCase,
    ChangeProductStatusUseCase,
    FetchAllCategoriesUseCase,
    AuthenticateSellerUseCase,
    RegisterProductViewUseCase,
  ],
})
export class httpModule {}
