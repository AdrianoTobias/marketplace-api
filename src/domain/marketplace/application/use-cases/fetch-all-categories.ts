import { Category } from '@/domain/marketplace/enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'

interface FetchAllCategoriesUseCaseResponse {
  categories: Category[]
}

export class FetchAllCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<FetchAllCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.listAll()

    return {
      categories,
    }
  }
}
