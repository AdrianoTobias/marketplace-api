import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateProductUseCaseRequest {
  title: string
  description: string
  priceInCents: number
  ownerId: string
  categoryId: string
}

interface CreateProductUseCaseResponse {
  product: Product
}

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    title,
    description,
    priceInCents,
    ownerId,
    categoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      title,
      description,
      priceInCents,
      ownerId: new UniqueEntityID(ownerId),
      categoryId: new UniqueEntityID(categoryId),
    })

    await this.productsRepository.create(product)

    return {
      product,
    }
  }
}
