import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SellersRepository } from '../repositories/sellers-repository'
import { CategoriesRepository } from '../repositories/categories-repository'

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
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    title,
    description,
    priceInCents,
    ownerId,
    categoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      throw new Error('Seller not found.')
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new Error('Category not found.')
    }

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
