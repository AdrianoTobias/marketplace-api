import { Category } from '../../enterprise/entities/category'

export interface CategoriesRepository {
  findById(id: string): Promise<Category | null>
  listAll(): Promise<Category[]>
  create(category: Category): Promise<void>
}
