import { GetSellerProfileUseCase } from '@/domain/marketplace/application/use-cases/get-seller-profile'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { UserPresenter } from '../presenters/user-presenter'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/sellers/me')
export class GetSellerProfileController {
  constructor(private getSellerProfile: GetSellerProfileUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getSellerProfile.execute({ id: userId })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { seller: UserPresenter.toHTTP(result.value.seller) }
  }
}
