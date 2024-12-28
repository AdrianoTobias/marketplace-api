import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateSellerUseCase } from '@/domain/marketplace/application/use-cases/authenticate-seller'

const authenticateSellerBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateSellerBodySchema = z.infer<typeof authenticateSellerBodySchema>

@Controller('/sellers/sessions')
export class AuthenticateSellerController {
  constructor(private authenticateSeller: AuthenticateSellerUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateSellerBodySchema))
  async handle(@Body() body: AuthenticateSellerBodySchema) {
    const { email, password } = body

    const result = await this.authenticateSeller.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const { accessToken } = result.value

    return {
      accessToken,
    }
  }
}
