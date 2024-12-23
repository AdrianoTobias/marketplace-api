import { ProductsRepository } from '../repositories/products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ViewersRepository } from '../repositories/viewers-repository'
import { View } from '../../enterprise/entities/view'
import { ViewsRepository } from '../repositories/views-repository'

interface RegisterProductViewUseCaseRequest {
  productId: string
  viewerId: string
}

interface RegisterProductViewUseCaseResponse {
  view: View
}

export class RegisterProductViewUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private viewersRepository: ViewersRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute({
    productId,
    viewerId,
  }: RegisterProductViewUseCaseRequest): Promise<RegisterProductViewUseCaseResponse> {
    const viewer = await this.viewersRepository.findById(viewerId)

    if (!viewer) {
      throw new Error('Viewer not found.')
    }

    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found.')
    }

    if (viewerId === product.ownerId.toString()) {
      throw new Error('Not allowed.')
    }

    const view = View.create({
      productId: new UniqueEntityID(productId),
      viewerId: new UniqueEntityID(viewerId),
    })

    const isViewed = await this.viewsRepository.isViewed(view)

    if (isViewed) {
      throw new Error('Cannot register a duclicate view.')
    }

    await this.viewsRepository.create(view)

    return {
      view,
    }
  }
}
