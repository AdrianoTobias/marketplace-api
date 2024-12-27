import {
  AsyncFindMany,
  AttachmentsRepository,
} from '@/domain/marketplace/application/repositories/attachments-repository'
import { Attachment } from '@/domain/marketplace/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  findManyByIds(ids: string[]): AsyncFindMany<Attachment> {
    throw new Error('Method not implemented.')
  }

  createMany(attachments: Attachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
