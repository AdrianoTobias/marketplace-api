import { ViewersRepository } from '@/domain/marketplace/application/repositories/viewers-repository'
import { Viewer } from '@/domain/marketplace/enterprise/entities/user/viewer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaViewerMapper } from '../mappers/prisma-viewer-mapper'

@Injectable()
export class PrismaViewersRepository implements ViewersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Viewer | null> {
    const viewer = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!viewer) {
      return null
    }

    return PrismaViewerMapper.toDomain(viewer)
  }

  async create(viewer: Viewer): Promise<void> {
    const data = PrismaViewerMapper.toPrisma(viewer)

    await this.prisma.user.create({
      data,
    })
  }
}
