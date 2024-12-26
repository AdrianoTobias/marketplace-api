import { ViewsRepository } from '../repositories/views-repository'
import { ProductsRepository } from '../repositories/products-repository'

interface CountProductViewsUseCaseRequest {
  productId: string
  from?: Date
}

interface CountProductViewsUseCaseResponse {
  amount: number
}

export class CountProductViewsUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute({
    productId,
    from,
  }: CountProductViewsUseCaseRequest): Promise<CountProductViewsUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found.')
    }

    const sellerId = product.ownerId.toString()

    const amount = await this.viewsRepository.count({
      sellerId,
      productId,
      from,
    })

    return {
      amount,
    }
  }
}
