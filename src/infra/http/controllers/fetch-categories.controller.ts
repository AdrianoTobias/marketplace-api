import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchAllCategoriesUseCase } from '@/domain/marketplace/application/use-cases/fetch-all-categories'
import { CategoryPresenter } from '../presenters/category-presenter'

@Controller('/categories')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private fetchAllCategories: FetchAllCategoriesUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchAllCategories.execute()

    if (result.isLeft()) {
      throw new Error()
    }

    const categories = result.value.categories

    return { categories: categories.map(CategoryPresenter.toHTTP) }
  }
}
