import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { SellerFactory } from 'test/factories/make-seller'

describe('Create Product (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sellerFactory: SellerFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    sellerFactory = moduleRef.get(SellerFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /products', async () => {
    const user = await sellerFactory.makePrismaSeller()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Product 01',
        description: 'Product 01 description',
        priceInCents: 1000,
        categoryId: category.id.toString(),
        attachmentsIds: [],
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      product: expect.objectContaining({
        title: 'Product 01',
        description: 'Product 01 description',
        priceInCents: 1000,
        status: 'available',
        owner: user.id.toString(),
        category: category.id.toString(),
      }),
    })

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        title: 'Product 01',
      },
    })

    expect(productOnDatabase).toBeTruthy()
  })
})
