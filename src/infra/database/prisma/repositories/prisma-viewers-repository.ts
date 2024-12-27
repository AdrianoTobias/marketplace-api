import { ViewersRepository } from '@/domain/marketplace/application/repositories/viewers-repository'
import { Viewer } from '@/domain/marketplace/enterprise/entities/user/viewer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaViewersRepository implements ViewersRepository {
  findById(id: string): Promise<Viewer | null> {
    throw new Error('Method not implemented.')
  }

  create(viewer: Viewer): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
