import { SellersRepository } from '@/domain/marketplace/application/repositories/sellers-repository'
import { Seller } from '@/domain/marketplace/enterprise/entities/user/seller'

export class InMemorySellersRepository implements SellersRepository {
  public items: Seller[] = []

  async findById(id: string) {
    const seller = this.items.find((item) => item.id.toString() === id)

    if (!seller) {
      return null
    }

    return seller
  }

  async findByEmail(email: string) {
    const seller = this.items.find((item) => item.email === email)

    if (!seller) {
      return null
    }

    return seller
  }

  async findByPhone(phone: string) {
    const seller = this.items.find((item) => item.phone === phone)

    if (!seller) {
      return null
    }

    return seller
  }

  async create(seller: Seller) {
    this.items.push(seller)
  }
}
