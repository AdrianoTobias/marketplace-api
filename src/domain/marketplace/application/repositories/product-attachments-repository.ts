import { ProductAttachment } from '../../enterprise/entities/product-attachment'

export interface ProductAttachmentsRepository {
  findManyByProductId(productId: string): Promise<ProductAttachment[]>
  createMany(attachments: ProductAttachment[]): Promise<void>
}
