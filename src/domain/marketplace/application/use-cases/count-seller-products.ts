import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { SellersRepository } from '../repositories/sellers-repository'

interface CountSellerProductsUseCaseRequest {
  sellerId: string
  status?: Product['status']
  from?: Date
}

interface CountSellerProductsUseCaseResponse {
  amount: number
}

export class CountSellerProductsUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    sellerId,
    status,
    from,
  }: CountSellerProductsUseCaseRequest): Promise<CountSellerProductsUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId)

    if (!seller) {
      throw new Error('Seller not found.')
    }

    const amount = await this.productsRepository.count({
      sellerId,
      status,
      from,
    })

    return {
      amount,
    }
  }
}
