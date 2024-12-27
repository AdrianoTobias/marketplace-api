import { Category } from '@/domain/marketplace/enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Either, right } from '@/core/either'

interface CreateCategoryUseCaseRequest {
  title: string
}

type CreateCategoryUseCaseResponse = Either<
  null,
  {
    category: Category
  }
>

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    title,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = Category.create({
      title,
    })

    await this.categoriesRepository.create(category)

    return right({
      category,
    })
  }
}
