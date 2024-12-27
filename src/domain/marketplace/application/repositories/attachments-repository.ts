import { Attachment } from '../../enterprise/entities/attachment'

export interface FindMany<T> {
  data: T[]
  hasAll: boolean
  inexistentIds: string[]
}
export type AsyncFindMany<T> = Promise<FindMany<T>>

export interface AttachmentsRepository {
  findManyByIds(ids: string[]): AsyncFindMany<Attachment>
  createMany(attachments: Attachment[]): Promise<void>
}
