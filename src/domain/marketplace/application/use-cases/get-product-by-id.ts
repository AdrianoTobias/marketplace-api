import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'

interface GetProductByIdUseCaseRequest {
  id: string
}

interface GetProductByIdUseCaseResponse {
  product: Product
}

export class GetProductByIdUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    id,
  }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      throw new Error('Product not found.')
    }

    return {
      product,
    }
  }
}
