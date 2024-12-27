import {
  Count,
  ViewsPerDay,
  ViewsRepository,
} from '@/domain/marketplace/application/repositories/views-repository'
import { View } from '@/domain/marketplace/enterprise/entities/view'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaViewsRepository implements ViewsRepository {
  count(params: Count): Promise<number> {
    throw new Error('Method not implemented.')
  }

  countPerDay(params: Count): Promise<ViewsPerDay[]> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<View | null> {
    throw new Error('Method not implemented.')
  }

  isViewed(view: View): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  create(view: View): Promise<View> {
    throw new Error('Method not implemented.')
  }
}
