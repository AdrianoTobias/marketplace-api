import { ProductAttachmentsRepository } from '@/domain/marketplace/application/repositories/product-attachments-repository'
import { ProductAttachment } from '@/domain/marketplace/enterprise/entities/product-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaProductAttachmentsRepository
  implements ProductAttachmentsRepository
{
  findManyByProductId(productId: string): Promise<ProductAttachment[]> {
    throw new Error('Method not implemented.')
  }

  createMany(attachments: ProductAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
