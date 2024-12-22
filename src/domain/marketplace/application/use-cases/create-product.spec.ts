import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { CreateProductUseCase } from './create-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeSeller } from 'test/factories/make-seller'
import { makeCategory } from 'test/factories/make-category'

let inMemorySellersRepository: InMemorySellersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateProductUseCase

describe('Create Product', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateProductUseCase(
      inMemorySellersRepository,
      inMemoryProductsRepository,
      inMemoryCategoriesRepository,
    )
  })

  it('should be able to create a product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    const { product } = await sut.execute({
      title: 'Novo produto',
      description: 'Descrição do produto',
      priceInCents: 1000,
      ownerId: seller.id.toValue(),
      categoryId: category.id.toValue(),
    })

    expect(product.id).toBeTruthy()
    expect(inMemoryProductsRepository.items[0].id).toEqual(product.id)
  })

  it('should not be able to create a product with a non-existent user', async () => {
    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    await expect(() => {
      return sut.execute({
        title: 'Novo produto',
        description: 'Descrição do produto',
        priceInCents: 1000,
        ownerId: 'non-existent-user',
        categoryId: category.id.toValue(),
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to create a product with a non-existent category', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    await expect(() => {
      return sut.execute({
        title: 'Novo produto',
        description: 'Descrição do produto',
        priceInCents: 1000,
        ownerId: seller.id.toValue(),
        categoryId: 'non-existent-category',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
