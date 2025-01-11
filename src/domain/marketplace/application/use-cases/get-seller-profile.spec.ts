import { GetSellerProfileUseCase } from './get-seller-profile'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { makeSeller } from 'test/factories/make-seller'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryUserAttachmentsRepository } from 'test/repositories/in-memory-user-attachments-repository'

let inMemoryUserAttachmentsRepository: InMemoryUserAttachmentsRepository
let inMemorySellersRepository: InMemorySellersRepository
let sut: GetSellerProfileUseCase

describe('Get Seller profile', () => {
  beforeEach(() => {
    inMemoryUserAttachmentsRepository = new InMemoryUserAttachmentsRepository()
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryUserAttachmentsRepository,
    )
    sut = new GetSellerProfileUseCase(inMemorySellersRepository)
  })

  it('should be able to get a seller profile', async () => {
    const newSeller = makeSeller({}, new UniqueEntityID('seller-1'))

    await inMemorySellersRepository.create(newSeller)

    const result = await sut.execute({
      id: 'seller-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      seller: expect.objectContaining({
        id: newSeller.id,
        email: newSeller.email,
      }),
    })
  })

  it('should not be able to get a non-existent seller profile', async () => {
    const result = await sut.execute({
      id: 'seller-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
