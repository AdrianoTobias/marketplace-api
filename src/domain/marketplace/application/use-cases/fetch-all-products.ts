import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'

interface FetchAllProductsUseCaseRequest {
  page: number
  search?: string
  status?: Product['status']
}

interface FetchAllProductsUseCaseResponse {
  products: Product[]
}

export class FetchAllProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
    search,
    status,
  }: FetchAllProductsUseCaseRequest): Promise<FetchAllProductsUseCaseResponse> {
    const products = await this.productsRepository.findMany({
      page,
      search,
      status,
    })

    return {
      products,
    }
  }
}
