import { ViewsPerDay, ViewsRepository } from '../repositories/views-repository'
import { SellersRepository } from '../repositories/sellers-repository'

interface CountSellerViewsPerDayUseCaseRequest {
  sellerId: string
  from?: Date
}

interface CountSellerViewsPerDayUseCaseResponse {
  viewsPerDay: ViewsPerDay[]
}

export class CountSellerViewsPerDayUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute({
    sellerId,
    from,
  }: CountSellerViewsPerDayUseCaseRequest): Promise<CountSellerViewsPerDayUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId)

    if (!seller) {
      throw new Error('Seller not found.')
    }

    const viewsPerDay = await this.viewsRepository.countPerDay({
      sellerId,
      from,
    })

    return {
      viewsPerDay,
    }
  }
}
