import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { SellerFactory } from 'test/factories/make-seller'
import { CategoryFactory } from 'test/factories/make-category'
import { ProductFactory } from 'test/factories/make-product'

describe('Get Product by id (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let categoryFactory: CategoryFactory
  let productFactory: ProductFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, CategoryFactory, ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    sellerFactory = moduleRef.get(SellerFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    productFactory = moduleRef.get(ProductFactory)

    await app.init()
  })

  test('[GET] /products/:id', async () => {
    const seller = await sellerFactory.makePrismaSeller()
    const category = await categoryFactory.makePrismaCategory()
    const product = await productFactory.makePrismaProduct({
      ownerId: seller.id,
      categoryId: category.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/products/${product.id}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      product: expect.objectContaining({
        id: product.id.toString(),
        title: product.title,
        description: product.description,
        priceInCents: product.priceInCents,
        status: product.status,
        owner: product.ownerId.toString(),
        category: product.categoryId.toString(),
      }),
    })
  })
})
