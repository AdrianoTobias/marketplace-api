import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database-module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ProductFactory } from 'test/factories/make-product'
import { SellerFactory } from 'test/factories/make-seller'

describe('Edit Product (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sellerFactory: SellerFactory
  let categoryFactory: CategoryFactory
  let productFactory: ProductFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, CategoryFactory, ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    sellerFactory = moduleRef.get(SellerFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    productFactory = moduleRef.get(ProductFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /products/:id', async () => {
    const user = await sellerFactory.makePrismaSeller()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category1 = await categoryFactory.makePrismaCategory()
    const category2 = await categoryFactory.makePrismaCategory()

    const product = await productFactory.makePrismaProduct({
      ownerId: user.id,
      categoryId: category1.id,
    })

    const productId = product.id.toString()
    const response = await request(app.getHttpServer())
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Product edited',
        description: 'Product description edited',
        priceInCents: 1000,
        categoryId: category2.id.toString(),
        attachmentsIds: [],
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      product: expect.objectContaining({
        title: 'Product edited',
        description: 'Product description edited',
        priceInCents: 1000,
        owner: user.id.toString(),
        category: category2.id.toString(),
      }),
    })

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        title: 'Product edited',
      },
    })

    expect(productOnDatabase).toBeTruthy()
  })
})
