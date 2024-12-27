import { EditProductUseCase } from './edit-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeCategory } from 'test/factories/make-category'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { makeSeller } from 'test/factories/make-seller'
import { ProductStatus } from '../../enterprise/entities/product'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemorySellersRepository: InMemorySellersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: EditProductUseCase

describe('Edit Product', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new EditProductUseCase(
      inMemorySellersRepository,
      inMemoryProductsRepository,
      inMemoryCategoriesRepository,
    )
  })

  it('should be able to edit a product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: seller.id,
    })

    await inMemoryProductsRepository.create(product)

    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: product.ownerId.toValue(),
      title: 'Produto editado',
      description: 'Descriação editada',
      priceInCents: 123,
      categoryId: category.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items[0]).toMatchObject({
      title: 'Produto editado',
      description: 'Descriação editada',
      priceInCents: 123,
      ownerId: seller.id,
      categoryId: category.id,
    })
  })

  it('should not be able to edit a product with a non-existent user', async () => {
    const product = makeProduct()

    await inMemoryProductsRepository.create(product)

    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: 'non-existent-user',
      title: 'Produto editado',
      description: 'Descriação editada',
      priceInCents: 123,
      categoryId: category.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a product with a non-existent category', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: seller.id,
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: product.ownerId.toValue(),
      title: 'Produto editado',
      description: 'Descriação editada',
      priceInCents: 123,
      categoryId: 'non-existent-category',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a non-existent product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: seller.id,
    })

    await inMemoryProductsRepository.create(product)

    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      productId: 'non-existent product',
      ownerId: product.ownerId.toValue(),
      title: 'Produto editado',
      description: 'Descriação editada',
      priceInCents: 123,
      categoryId: category.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a product from another user', async () => {
    const seller = makeSeller({}, new UniqueEntityID('owner-1'))

    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: new UniqueEntityID('owner-2'),
    })

    await inMemoryProductsRepository.create(product)

    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: 'owner-1',
      title: 'Produto editado',
      description: 'Descriação editada',
      priceInCents: 123,
      categoryId: category.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a sold product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: seller.id,
      status: ProductStatus.SOLD,
    })

    await inMemoryProductsRepository.create(product)

    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: product.ownerId.toValue(),
      title: 'Produto editado',
      description: 'Descriação editada',
      priceInCents: 123,
      categoryId: category.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
