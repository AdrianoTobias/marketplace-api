import { CountSellerViewsPerDayUseCase } from './count-seller-views-per-day'
import { InMemoryViewsRepository } from 'test/repositories/in-memory-views-repository'
import { makeView } from 'test/factories/make-view'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { makeSeller } from 'test/factories/make-seller'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemorySellersRepository: InMemorySellersRepository
let inMemoryViewsRepository: InMemoryViewsRepository
let sut: CountSellerViewsPerDayUseCase

describe('Count Seller Views per day', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    inMemoryViewsRepository = new InMemoryViewsRepository()
    sut = new CountSellerViewsPerDayUseCase(
      inMemorySellersRepository,
      inMemoryViewsRepository,
    )
  })

  it('should be able to count the views per day received by the seller in the last 30 days', async () => {
    const baseView = makeView({ createdAt: new Date('1900-01-01') })

    const seller = makeSeller({}, baseView.product.ownerId)
    await inMemorySellersRepository.create(seller)

    for (let i = 1; i <= 50; i++) {
      const fakerCreatedAt = new Date()
      fakerCreatedAt.setDate(fakerCreatedAt.getDate() - i * 2)

      const view = makeView({
        product: baseView.product,
        createdAt: fakerCreatedAt,
      })

      await inMemoryViewsRepository.create(view)
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const oneMoreView = makeView({
      product: baseView.product,
      createdAt: thirtyDaysAgo,
    })
    await inMemoryViewsRepository.create(oneMoreView)

    const result = await sut.execute({
      sellerId: seller.id.toValue(),
      from: thirtyDaysAgo,
    })

    expect(result.value).toMatchObject({
      viewsPerDay: expect.arrayContaining(new Array(15)),
    })
    expect(result.value).toMatchObject({
      viewsPerDay: expect.arrayContaining([
        expect.objectContaining({
          date: new Date(
            new Date(new Date(thirtyDaysAgo).setHours(0, 0, 0, 0))
              .toISOString()
              .split('T')[0],
          ),
          amount: 2,
        }),
      ]),
    })
  })

  it('should not be able to count views of a non-existent seller', async () => {
    const view = makeView()
    await inMemoryViewsRepository.create(view)

    const result = await sut.execute({
      sellerId: 'seller-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
