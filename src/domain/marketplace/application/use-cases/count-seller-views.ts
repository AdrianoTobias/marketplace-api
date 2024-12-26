import { ViewsRepository } from '../repositories/views-repository'
import { SellersRepository } from '../repositories/sellers-repository'

interface CountSellerViewsUseCaseRequest {
  sellerId: string
  from?: Date
}

interface CountSellerViewsUseCaseResponse {
  amount: number
}

export class CountSellerViewsUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute({
    sellerId,
    from,
  }: CountSellerViewsUseCaseRequest): Promise<CountSellerViewsUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId)

    if (!seller) {
      throw new Error('Seller not found.')
    }

    const amount = await this.viewsRepository.count({
      sellerId,
      from,
    })

    return {
      amount,
    }
  }
}
