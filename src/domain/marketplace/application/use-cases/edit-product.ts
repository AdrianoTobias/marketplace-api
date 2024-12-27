import {
  Product,
  ProductStatus,
} from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { CategoriesRepository } from '../repositories/categories-repository'
import { SellersRepository } from '../repositories/sellers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditProductUseCaseRequest {
  productId: string
  ownerId: string
  title: string
  description: string
  priceInCents: number
  categoryId: string
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

export class EditProductUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    productId,
    ownerId,
    title,
    description,
    priceInCents,
    categoryId,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (seller.id !== product.ownerId) {
      return left(new NotAllowedError())
    }

    if (product.status === ProductStatus.SOLD) {
      return left(new NotAllowedError())
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    product.title = title
    product.description = description
    product.priceInCents = priceInCents
    product.categoryId = category.id

    await this.productsRepository.save(product)

    return right({
      product,
    })
  }
}
