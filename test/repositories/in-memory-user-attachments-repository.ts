import { UserAttachmentsRepository } from '@/domain/marketplace/application/repositories/user-attachments-repository'
import { UserAttachment } from '@/domain/marketplace/enterprise/entities/user/user-attachment'

export class InMemoryUserAttachmentsRepository
  implements UserAttachmentsRepository
{
  async findByUserId(userId: string) {
    const attachment = this.items.find(
      (item) => item.userId.toString() === userId,
    )

    if (!attachment) {
      return null
    }

    return attachment
  }

  public items: UserAttachment[] = []

  async create(attachment: UserAttachment) {
    this.items.push(attachment)
  }
}
