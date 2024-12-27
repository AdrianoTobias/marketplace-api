import {
  Count,
  FindMany,
  FindManyByOwner,
  ProductsRepository,
} from '@/domain/marketplace/application/repositories/products-repository'
import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  count(params: Count): Promise<number> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Product | null> {
    throw new Error('Method not implemented.')
  }

  findManyByOwner(params: FindManyByOwner): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }

  findMany(params: FindMany): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }

  save(product: Product): Promise<void> {
    throw new Error('Method not implemented.')
  }

  create(product: Product): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
