import { View } from '../../enterprise/entities/view'

export interface Count {
  sellerId: string
  from?: Date
}

export interface ViewsRepository {
  count(params: Count): Promise<number>
  findById(id: string): Promise<View | null>
  isViewed(view: View): Promise<boolean>
  create(view: View): Promise<View>
}
