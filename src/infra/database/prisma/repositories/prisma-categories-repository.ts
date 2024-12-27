import { CategoriesRepository } from '@/domain/marketplace/application/repositories/categories-repository'
import { Category } from '@/domain/marketplace/enterprise/entities/category'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  findById(id: string): Promise<Category | null> {
    throw new Error('Method not implemented.')
  }

  listAll(): Promise<Category[]> {
    throw new Error('Method not implemented.')
  }

  create(category: Category): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
