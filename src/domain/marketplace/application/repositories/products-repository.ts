import { Product } from '../../enterprise/entities/product'

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>
  save(product: Product): Promise<void>
  create(product: Product): Promise<void>
}
