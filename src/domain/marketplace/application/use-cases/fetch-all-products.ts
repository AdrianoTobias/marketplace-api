import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchAllProductsUseCaseRequest {
  page: number
  search?: string
  status?: Product['status']
}

type FetchAllProductsUseCaseResponse = Either<
  null,
  {
    products: Product[]
  }
>

@Injectable()
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

    return right({
      products,
    })
  }
}
