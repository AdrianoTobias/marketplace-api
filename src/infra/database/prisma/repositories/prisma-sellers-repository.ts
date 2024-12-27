import { SellersRepository } from '@/domain/marketplace/application/repositories/sellers-repository'
import { Seller } from '@/domain/marketplace/enterprise/entities/user/seller'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaSellersRepository implements SellersRepository {
  findById(id: string): Promise<Seller | null> {
    throw new Error('Method not implemented.')
  }

  create(product: Seller): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
