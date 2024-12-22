import {
  Product,
  ProductStatus,
} from '@/domain/marketplace/enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { CategoriesRepository } from '../repositories/categories-repository'
import { SellersRepository } from '../repositories/sellers-repository'

interface EditProductUseCaseRequest {
  productId: string
  ownerId: string
  title: string
  description: string
  priceInCents: number
  categoryId: string
}

interface EditProductUseCaseResponse {
  product: Product
}

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
      throw new Error('Seller not found.')
    }

    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found.')
    }

    if (seller.id !== product.ownerId) {
      throw new Error('Not allowed.')
    }

    if (product.status === ProductStatus.SOLD) {
      throw new Error('Not allowed.')
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new Error('Category not found.')
    }

    product.title = title
    product.description = description
    product.priceInCents = priceInCents
    product.categoryId = category.id

    await this.productsRepository.save(product)

    return {
      product,
    }
  }
}
