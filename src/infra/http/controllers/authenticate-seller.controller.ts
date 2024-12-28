import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateSellerUseCase } from '@/domain/marketplace/application/use-cases/authenticate-seller'
import { WrongCredentialsError } from '@/domain/marketplace/application/use-cases/errors/wrong-credentials-error'

const authenticateSellerBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateSellerBodySchema = z.infer<typeof authenticateSellerBodySchema>

@Controller('/sellers/sessions')
export class AuthenticateSellerController {
  constructor(private authenticateSeller: AuthenticateSellerUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateSellerBodySchema))
  async handle(@Body() body: AuthenticateSellerBodySchema) {
    const { email, password } = body

    const result = await this.authenticateSeller.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      accessToken,
    }
  }
}
