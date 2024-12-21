import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'crypto'
import request from 'supertest'

describe('Fetch recent products (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /products', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        phone: '123456789',
        email: 'johndoe@example.com',
        avatarId: null,
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const categoryId = randomUUID()

    await prisma.category.create({
      data: {
        id: categoryId,
        title: 'Category 01',
        slug: 'category-01',
      },
    })

    await prisma.product.createMany({
      data: [
        {
          ownerId: user.id,
          title: 'Product 01',
          description: 'Product 01 description',
          priceInCents: 1000,
          categoryId,
          status: 'available',
        },
        {
          ownerId: user.id,
          title: 'Product 02',
          description: 'Product 02 description',
          priceInCents: 2000,
          categoryId,
          status: 'available',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      products: [
        expect.objectContaining({ title: 'Product 01' }),
        expect.objectContaining({ title: 'Product 02' }),
      ],
    })
  })
})
