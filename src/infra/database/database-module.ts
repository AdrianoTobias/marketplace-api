import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository'
import { PrismaProductAttachmentsRepository } from './prisma/repositories/prisma-product-attachments-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'
import { PrismaSellersRepository } from './prisma/repositories/prisma-sellers-repository'
import { PrismaViewersRepository } from './prisma/repositories/prisma-viewers-repository'
import { PrismaViewsRepository } from './prisma/repositories/prisma-views-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAttachmentsRepository,
    PrismaCategoriesRepository,
    PrismaProductAttachmentsRepository,
    PrismaProductsRepository,
    PrismaSellersRepository,
    PrismaViewersRepository,
    PrismaViewsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAttachmentsRepository,
    PrismaCategoriesRepository,
    PrismaProductAttachmentsRepository,
    PrismaProductsRepository,
    PrismaSellersRepository,
    PrismaViewersRepository,
    PrismaViewsRepository,
  ],
})
export class DatabaseModule {}
