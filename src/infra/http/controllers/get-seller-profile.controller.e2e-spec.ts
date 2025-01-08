import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { SellerFactory } from 'test/factories/make-seller'

describe('Get Seller profile (E2E)', () => {
  let app: INestApplication
  let sellerFactory: SellerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    sellerFactory = moduleRef.get(SellerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /sellers/me', async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/sellers/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      seller: expect.objectContaining({
        name: 'John Doe',
        phone: '123456789',
        email: 'johndoe@example.com',
      }),
    })
  })
})
