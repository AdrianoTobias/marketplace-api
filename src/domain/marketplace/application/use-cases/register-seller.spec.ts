import { RegisterSellerUseCase } from './register-seller'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeSeller } from 'test/factories/make-seller'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists-error'

let inMemorySellersRepository: InMemorySellersRepository
let fakeHasher: FakeHasher

let sut: RegisterSellerUseCase

describe('Register Seller', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterSellerUseCase(inMemorySellersRepository, fakeHasher)
  })

  it('should be able to register a new seller', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      seller: inMemorySellersRepository.items[0],
    })
  })

  it('should hash seller password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemorySellersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register a seller with an already registered email', async () => {
    const seller = makeSeller({ email: 'johndoe@example.com' })
    await inMemorySellersRepository.create(seller)

    const result = await sut.execute({
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should not be able to register a seller with an already registered phone', async () => {
    const seller = makeSeller({ phone: '123456789' })
    await inMemorySellersRepository.create(seller)

    const result = await sut.execute({
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PhoneAlreadyExistsError)
  })
})
