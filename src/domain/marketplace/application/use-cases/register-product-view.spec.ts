import { RegisterProductViewUseCase } from './register-product-view'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryViewersRepository } from 'test/repositories/in-memory-viewers-repository'
import { InMemoryViewsRepository } from 'test/repositories/in-memory-views-repository'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeViewer } from 'test/factories/make-viewer'
import { makeView } from 'test/factories/make-view'

let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryViewersRepository: InMemoryViewersRepository
let inMemoryViewsRepository: InMemoryViewsRepository
let sut: RegisterProductViewUseCase

describe('Register Product View', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryViewersRepository = new InMemoryViewersRepository()
    inMemoryViewsRepository = new InMemoryViewsRepository()
    sut = new RegisterProductViewUseCase(
      inMemoryProductsRepository,
      inMemoryViewersRepository,
      inMemoryViewsRepository,
    )
  })

  it('should be able to register a product view', async () => {
    const product = makeProduct({ ownerId: new UniqueEntityID('user-1') })
    await inMemoryProductsRepository.create(product)

    const viewer = makeViewer({}, new UniqueEntityID('user-2'))
    await inMemoryViewersRepository.create(viewer)

    const { view } = await sut.execute({
      productId: product.id.toValue(),
      viewerId: viewer.id.toValue(),
    })

    expect(view.id).toBeTruthy()
    expect(inMemoryViewsRepository.items[0].id).toEqual(view.id)
  })

  it('should not be able to register a view on a non-existent product', async () => {
    const viewer = makeViewer({}, new UniqueEntityID('user-1'))
    await inMemoryViewersRepository.create(viewer)

    await expect(() => {
      return sut.execute({
        productId: 'product-1',
        viewerId: viewer.id.toValue(),
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to register a product view with a non-existent user', async () => {
    const product = makeProduct({ ownerId: new UniqueEntityID('user-1') })
    await inMemoryProductsRepository.create(product)

    await expect(() => {
      return sut.execute({
        productId: product.id.toValue(),
        viewerId: 'user-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to register a product view with the product owner', async () => {
    const product = makeProduct({ ownerId: new UniqueEntityID('user-1') })
    await inMemoryProductsRepository.create(product)

    const viewer = makeViewer({}, new UniqueEntityID('user-1'))
    await inMemoryViewersRepository.create(viewer)

    await expect(() => {
      return sut.execute({
        productId: product.id.toValue(),
        viewerId: viewer.id.toValue(),
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to register a duplicate product view', async () => {
    const product = makeProduct({ ownerId: new UniqueEntityID('user-1') })
    await inMemoryProductsRepository.create(product)

    const viewer = makeViewer({}, new UniqueEntityID('user-2'))
    await inMemoryViewersRepository.create(viewer)

    const view = makeView({ productId: product.id, viewerId: viewer.id })
    await inMemoryViewsRepository.create(view)

    await expect(() => {
      return sut.execute({
        productId: view.productId.toValue(),
        viewerId: view.viewerId.toValue(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
