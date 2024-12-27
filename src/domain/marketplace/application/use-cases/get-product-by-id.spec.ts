import { GetProductByIdUseCase } from './get-product-by-id'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: GetProductByIdUseCase

describe('Get Product by id', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new GetProductByIdUseCase(inMemoryProductsRepository)
  })

  it('should be able to get a product by id', async () => {
    const newProduct = makeProduct({}, new UniqueEntityID('product-1'))

    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      id: 'product-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: expect.objectContaining({
        id: newProduct.id,
        title: newProduct.title,
      }),
    })
  })
})
