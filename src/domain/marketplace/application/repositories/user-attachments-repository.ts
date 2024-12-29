import { UserAttachment } from '../../enterprise/entities/user/user-attachment'

export interface UserAttachmentsRepository {
  findByUserId(userId: string): Promise<UserAttachment | null>
  create(attachment: UserAttachment): Promise<void>
}
