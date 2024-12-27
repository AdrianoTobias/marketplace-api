import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch categories (E2E)', () => {
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

  test('[GET] /categories', async () => {
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

    await prisma.category.createMany({
      data: [
        {
          title: 'Category 01',
          slug: 'category-01',
        },
        {
          title: 'Category 02',
          slug: 'category-02',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    console.log(response)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      categories: [
        expect.objectContaining({ slug: 'category-01' }),
        expect.objectContaining({ slug: 'category-02' }),
      ],
    })
  })
})
