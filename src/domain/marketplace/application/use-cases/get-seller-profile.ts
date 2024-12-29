import { Seller } from '@/domain/marketplace/enterprise/entities/user/seller'
import { SellersRepository } from '../repositories/sellers-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetSellerProfileUseCaseRequest {
  id: string
}

type GetSellerProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    seller: Seller
  }
>

export class GetSellerProfileUseCase {
  constructor(private sellersRepository: SellersRepository) {}

  async execute({
    id,
  }: GetSellerProfileUseCaseRequest): Promise<GetSellerProfileUseCaseResponse> {
    const seller = await this.sellersRepository.findById(id)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    return right({
      seller,
    })
  }
}
