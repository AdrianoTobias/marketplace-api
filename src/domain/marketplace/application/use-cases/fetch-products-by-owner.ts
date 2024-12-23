import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { SellersRepository } from '../repositories/sellers-repository'

interface FetchProductsByOwnerIdUseCaseRequest {
  ownerId: string
  search?: string
  status?: Product['status']
}

interface FetchProductsByOwnerIdUseCaseResponse {
  products: Product[]
}

export class FetchProductsByOwnerIdUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    ownerId,
    search,
    status,
  }: FetchProductsByOwnerIdUseCaseRequest): Promise<FetchProductsByOwnerIdUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      throw new Error('Seller not found.')
    }

    const products = await this.productsRepository.findManyByOwner({
      ownerId,
      search,
      status,
    })

    return {
      products,
    }
  }
}
