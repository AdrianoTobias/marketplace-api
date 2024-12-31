import {
  Count,
  FindMany,
  FindManyByOwner,
  ProductsRepository,
} from '@/domain/marketplace/application/repositories/products-repository'
import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async count({ sellerId, from, status }: Count): Promise<number> {
    const where: Record<string, unknown> = {
      sellerId,
    }

    if (from) {
      where.statusAt = { gte: from }
    }

    if (status) {
      where.status = status
    }

    const amount = await this.prisma.product.count({
      where,
    })

    return amount
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findManyByOwner({
    ownerId,
    search,
    status,
  }: FindManyByOwner): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        ownerId,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(status ? { status } : {}),
      },
    })

    return products.map(PrismaProductMapper.toDomain)
  }

  async findMany({ page, search, status }: FindMany): Promise<Product[]> {
    const perPage = 3

    const products = await this.prisma.product.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(status ? { status } : {}),
      },
    })

    return products.map(PrismaProductMapper.toDomain)
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.update({
      where: {
        id: product.id.toString(),
      },
      data,
    })
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.create({
      data,
    })
  }
}
