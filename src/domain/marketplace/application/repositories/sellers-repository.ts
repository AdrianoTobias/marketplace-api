import { Seller } from '../../enterprise/entities/user/seller'

export interface SellersRepository {
  findById(id: string): Promise<Seller | null>
  create(product: Seller): Promise<void>
}
