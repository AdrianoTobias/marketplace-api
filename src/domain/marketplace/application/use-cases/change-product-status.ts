import {
  Product,
  ProductStatus,
} from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { SellersRepository } from '../repositories/sellers-repository'

interface ChangeProductStatusUseCaseRequest {
  productId: string
  ownerId: string
  newStatus: ProductStatus
}

interface ChangeProductStatusUseCaseResponse {
  product: Product
}

export class ChangeProductStatusUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    productId,
    ownerId,
    newStatus,
  }: ChangeProductStatusUseCaseRequest): Promise<ChangeProductStatusUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      throw new Error('Seller not found.')
    }

    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found.')
    }

    if (seller.id !== product.ownerId) {
      throw new Error('Not allowed.')
    }

    if (
      product.status === ProductStatus.SOLD &&
      newStatus === ProductStatus.CANCELLED
    ) {
      throw new Error('Product must be available to be marked as sold.')
    }

    if (
      product.status === ProductStatus.CANCELLED &&
      newStatus === ProductStatus.SOLD
    ) {
      throw new Error('Product must be available to be marked as cancelled.')
    }

    product.status = newStatus

    await this.productsRepository.save(product)

    return {
      product,
    }
  }
}
