import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Category (E2E)', () => {
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

  test('[POST] /categories', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Category 01',
      })

    expect(response.statusCode).toBe(201)

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        slug: 'category-01',
      },
    })

    expect(categoryOnDatabase).toBeTruthy()
  })
})
