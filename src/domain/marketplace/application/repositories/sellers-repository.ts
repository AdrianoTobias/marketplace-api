import { Seller } from '../../enterprise/entities/user/seller'

export abstract class SellersRepository {
  abstract findById(id: string): Promise<Seller | null>
  abstract findByEmail(email: string): Promise<Seller | null>
  abstract findByPhone(phone: string): Promise<Seller | null>
  abstract create(product: Seller): Promise<void>
}
