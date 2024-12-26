import { CountSellerViewsPerDayUseCase } from './count-seller-views-per-day'
import { InMemoryViewsRepository } from 'test/repositories/in-memory-views-repository'
import { makeView } from 'test/factories/make-view'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { makeSeller } from 'test/factories/make-seller'

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
    const baseView = makeView()

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
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const oneMoreView = makeView({
      product: baseView.product,
      createdAt: thirtyDaysAgo,
    })
    await inMemoryViewsRepository.create(oneMoreView)

    const { viewsPerDay } = await sut.execute({
      sellerId: seller.id.toValue(),
      from: thirtyDaysAgo,
    })

    expect(viewsPerDay).length(15)
    expect(viewsPerDay[14]).toEqual(
      expect.objectContaining({
        date: new Date(
          Date.UTC(
            thirtyDaysAgo.getFullYear(),
            thirtyDaysAgo.getMonth(),
            thirtyDaysAgo.getDate(),
          ),
        ),
        amount: 2,
      }),
    )
  })

  it('should not be able to count views of a non-existent seller', async () => {
    const view = makeView()
    await inMemoryViewsRepository.create(view)

    await expect(() => {
      return sut.execute({
        sellerId: 'seller-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
