import { Category } from '../../enterprise/entities/category'

export interface CategoriesRepository {
  listAll(): Promise<Category[]>
  create(category: Category): Promise<void>
}
