import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { FetchAllProductsUseCase } from './fetch-all-products'
import { ProductStatus } from '../../enterprise/entities/product'
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryUserAttachmentsRepository } from 'test/repositories/in-memory-user-attachments-repository'

let inMemoryUserAttachmentsRepository: InMemoryUserAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemorySellersRepository: InMemorySellersRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: FetchAllProductsUseCase

describe('Fetch All Products', () => {
  beforeEach(() => {
    inMemoryUserAttachmentsRepository = new InMemoryUserAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryUserAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryProductAttachmentsRepository =
      new InMemoryProductAttachmentsRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductAttachmentsRepository,
      inMemorySellersRepository,
      inMemoryCategoriesRepository,
      inMemoryAttachmentsRepository,
    )
    sut = new FetchAllProductsUseCase(inMemoryProductsRepository)
  })

  it('should be able to fetch all products', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2024, 11, 20) }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2024, 11, 18) }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2024, 11, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 11, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 11, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 11, 18) }),
    ])
  })

  it('should be able to fetch paginated all products', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryProductsRepository.create(makeProduct())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(2)
  })

  it('should be able to fetch filtered products by title or description', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({
        title: 'Produto 1',
        description: 'Descrição 123',
        createdAt: new Date(2024, 11, 20),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        title: 'Produto 2',
        description: 'Descrição 456',
        createdAt: new Date(2024, 11, 18),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        title: 'Produto 3',
        description: 'Descrição 789',
        createdAt: new Date(2024, 11, 23),
      }),
    )

    const result = await sut.execute({
      page: 1,
      search: '2',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toEqual([
      expect.objectContaining({
        title: 'Produto 1',
        description: 'Descrição 123',
        createdAt: new Date(2024, 11, 20),
      }),
      expect.objectContaining({
        title: 'Produto 2',
        description: 'Descrição 456',
        createdAt: new Date(2024, 11, 18),
      }),
    ])
  })

  it('should be able to fetch filtered products by status', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 20),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        status: ProductStatus.SOLD,
        createdAt: new Date(2024, 11, 18),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 23),
      }),
    )

    const result = await sut.execute({
      page: 1,
      status: ProductStatus.AVAILABLE,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toEqual([
      expect.objectContaining({
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 23),
      }),
      expect.objectContaining({
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 20),
      }),
    ])
  })

  it('should be able to fetch filtered products by title or description and status', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({
        title: 'Produto 1',
        description: 'Descrição 123',
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 20),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        title: 'Produto 2',
        description: 'Descrição 456',
        status: ProductStatus.SOLD,
        createdAt: new Date(2024, 11, 18),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        title: 'Produto 3',
        description: 'Descrição 789',
        status: ProductStatus.CANCELLED,
        createdAt: new Date(2024, 11, 23),
      }),
    )

    const result = await sut.execute({
      page: 1,
      search: '2',
      status: ProductStatus.AVAILABLE,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toEqual([
      expect.objectContaining({
        title: 'Produto 1',
        description: 'Descrição 123',
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 20),
      }),
    ])
  })
})
