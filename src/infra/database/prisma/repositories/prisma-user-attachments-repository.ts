import { UserAttachmentsRepository } from '@/domain/marketplace/application/repositories/user-attachments-repository'
import { UserAttachment } from '@/domain/marketplace/enterprise/entities/user/user-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUserAttachmentsRepository
  implements UserAttachmentsRepository
{
  findByUserId(userId: string): Promise<UserAttachment | null> {
    throw new Error('Method not implemented.')
  }

  create(attachment: UserAttachment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
