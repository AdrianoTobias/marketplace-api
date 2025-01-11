import { SellersRepository } from '@/domain/marketplace/application/repositories/sellers-repository'
import { UserAttachmentsRepository } from '@/domain/marketplace/application/repositories/user-attachments-repository'
import { Seller } from '@/domain/marketplace/enterprise/entities/user/seller'

export class InMemorySellersRepository implements SellersRepository {
  public items: Seller[] = []

  constructor(private userAttachmentsRepository: UserAttachmentsRepository) {}

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

  async save(seller: Seller) {
    const itemIndex = this.items.findIndex((item) => item.id === seller.id)

    this.items[itemIndex] = seller

    const hasNewAvatar = seller.avatar.getNewItems().length > 0
    const hasOldAvatar = seller.avatar.getRemovedItems().length > 0

    if (hasNewAvatar) {
      const newAvatar = seller.avatar.getNewItems()[0]

      await this.userAttachmentsRepository.create(newAvatar)
    }

    if (hasOldAvatar) {
      const oldAvatar = seller.avatar.getRemovedItems()[0]

      await this.userAttachmentsRepository.delete(oldAvatar)
    }
  }

  async create(seller: Seller) {
    this.items.push(seller)

    const hasAvatar = seller.avatar.getItems().length > 0

    if (hasAvatar) {
      const avatar = seller.avatar.getItems()[0]

      await this.userAttachmentsRepository.create(avatar)
    }
  }
}
