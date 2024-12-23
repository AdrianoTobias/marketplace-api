import { PaginationParams } from '@/core/repositories/pagination-params'
import { Product } from '../../enterprise/entities/product'

export interface FindMany extends PaginationParams {
  search?: string
  status?: Product['status']
}

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>
  findMany(params: FindMany): Promise<Product[]>
  save(product: Product): Promise<void>
  create(product: Product): Promise<void>
}
