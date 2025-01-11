import { SellersRepository } from '@/domain/marketplace/application/repositories/sellers-repository'
import { Seller } from '@/domain/marketplace/enterprise/entities/user/seller'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaSellerMapper } from '../mappers/prisma-seller-mapper'
import { UserAttachmentsRepository } from '@/domain/marketplace/application/repositories/user-attachments-repository'

@Injectable()
export class PrismaSellersRepository implements SellersRepository {
  constructor(
    private prisma: PrismaService,
    private userAttachmentsRepository: UserAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!seller) {
      return null
    }

    return PrismaSellerMapper.toDomain(seller)
  }

  async findByEmail(email: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!seller) {
      return null
    }

    return PrismaSellerMapper.toDomain(seller)
  }

  async findByPhone(phone: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    })

    if (!seller) {
      return null
    }

    return PrismaSellerMapper.toDomain(seller)
  }

  async save(seller: Seller): Promise<void> {
    const data = PrismaSellerMapper.toPrisma(seller)

    if (seller.avatar.getRemovedItems().length) {
      await this.userAttachmentsRepository.delete(
        seller.avatar.getRemovedItems()[0],
      )
    }

    await this.prisma.user.update({
      where: {
        id: seller.id.toString(),
      },
      data,
    })

    if (seller.avatar.getNewItems().length) {
      await this.userAttachmentsRepository.create(
        seller.avatar.getNewItems()[0],
      )
    }
  }

  async create(seller: Seller): Promise<void> {
    const data = PrismaSellerMapper.toPrisma(seller)

    await this.prisma.user.create({
      data,
    })

    const hasAvatar = seller.avatar.getItems().length > 0

    if (hasAvatar) {
      const userAttachment = seller.avatar.getItems()[0]

      await this.userAttachmentsRepository.create(userAttachment)
    }
  }
}
