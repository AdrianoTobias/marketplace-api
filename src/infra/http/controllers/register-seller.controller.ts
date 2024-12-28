import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterSellerUseCase } from '@/domain/marketplace/application/use-cases/register-seller'
import { EmailAlreadyExistsError } from '@/domain/marketplace/application/use-cases/errors/email-already-exists-error'
import { PhoneAlreadyExistsError } from '@/domain/marketplace/application/use-cases/errors/phone-already-exists-error'

const resgisterSellerBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type ResgisterSellerBodySchema = z.infer<typeof resgisterSellerBodySchema>

@Controller('/sellers')
export class ResgisterSellerController {
  constructor(private registerSeller: RegisterSellerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(resgisterSellerBodySchema))
  async handle(@Body() body: ResgisterSellerBodySchema) {
    const { name, phone, email, password } = body

    const result = await this.registerSeller.execute({
      name,
      phone,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message)
        case PhoneAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
