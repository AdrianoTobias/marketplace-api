import {
  AsyncFindMany,
  AttachmentsRepository,
} from '@/domain/marketplace/application/repositories/attachments-repository'
import { Attachment } from '@/domain/marketplace/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  findById(id: string): Promise<Attachment | null> {
    throw new Error('Method not implemented.')
  }

  findManyByIds(ids: string[]): AsyncFindMany<Attachment> {
    throw new Error('Method not implemented.')
  }

  create(attachment: Attachment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  createMany(attachments: Attachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
