import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterSellerUseCase } from '@/domain/marketplace/application/use-cases/register-seller'

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
      throw new Error()
    }
  }
}
