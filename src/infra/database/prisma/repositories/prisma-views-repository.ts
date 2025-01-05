import {
  Count,
  ViewsPerDay,
  ViewsRepository,
} from '@/domain/marketplace/application/repositories/views-repository'
import { View } from '@/domain/marketplace/enterprise/entities/view'
import { Injectable } from '@nestjs/common'
import { PrismaViewMapper } from '../mappers/prisma-view-mapper'
import { PrismaService } from '../prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaViewsRepository implements ViewsRepository {
  constructor(private prisma: PrismaService) {}

  async count({ sellerId, productId, from }: Count): Promise<number> {
    const where: Prisma.ViewWhereInput = {
      product: {
        ownerId: sellerId,
      },
    }

    if (productId) {
      where.productId = productId
    }

    if (from) {
      where.createdAt = { gte: new Date(from.toISOString().split('T')[0]) }
    }

    const amount = await this.prisma.view.count({
      where,
    })

    return amount
  }

  async countPerDay({
    sellerId,
    productId,
    from,
  }: Count): Promise<ViewsPerDay[]> {
    const where: Record<string, unknown> = {
      sellerId,
    }

    if (productId) {
      where.productId = productId
    }

    if (from) {
      where.statusAt = { gte: from }
    }

    const groupedResults = await this.prisma.view.groupBy({
      by: ['createdAt'],
      where,
      _count: {
        _all: true,
      },
    })

    return groupedResults.map((result) => ({
      date: result.createdAt,
      amount: result._count._all,
    }))
  }

  async findById(id: string): Promise<View | null> {
    const view = await this.prisma.view.findUnique({
      where: {
        id,
      },
      include: {
        viewer: true,
        product: true,
      },
    })

    if (!view) {
      return null
    }

    return PrismaViewMapper.toDomain(view)
  }

  async isViewed({ viewer, product }: View): Promise<boolean> {
    const view = await this.prisma.view.findUnique({
      where: {
        viewerId_productId: {
          viewerId: viewer.id.toString(),
          productId: product.id.toString(),
        },
      },
    })

    return !!view
  }

  async create(view: View): Promise<View> {
    const data = PrismaViewMapper.toPrisma(view)

    await this.prisma.view.create({
      data,
    })

    return view
  }
}
