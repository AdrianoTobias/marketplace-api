import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository'
import { PrismaProductAttachmentsRepository } from './prisma/repositories/prisma-product-attachments-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'
import { PrismaSellersRepository } from './prisma/repositories/prisma-sellers-repository'
import { PrismaViewersRepository } from './prisma/repositories/prisma-viewers-repository'
import { PrismaViewsRepository } from './prisma/repositories/prisma-views-repository'
import { CategoriesRepository } from '@/domain/marketplace/application/repositories/categories-repository'
import { SellersRepository } from '@/domain/marketplace/application/repositories/sellers-repository'
import { AttachmentsRepository } from '@/domain/marketplace/application/repositories/attachments-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    PrismaProductAttachmentsRepository,
    PrismaProductsRepository,
    {
      provide: SellersRepository,
      useClass: PrismaSellersRepository,
    },
    PrismaViewersRepository,
    PrismaViewsRepository,
  ],
  exports: [
    PrismaService,
    AttachmentsRepository,
    CategoriesRepository,
    PrismaProductAttachmentsRepository,
    PrismaProductsRepository,
    SellersRepository,
    PrismaViewersRepository,
    PrismaViewsRepository,
  ],
})
export class DatabaseModule {}
