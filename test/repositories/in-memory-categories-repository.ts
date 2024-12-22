import { CategoriesRepository } from '@/domain/marketplace/application/repositories/categories-repository'
import { Category } from '@/domain/marketplace/enterprise/entities/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async listAll() {
    return this.items
  }

  async create(category: Category) {
    this.items.push(category)
  }
}
