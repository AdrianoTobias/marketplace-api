import { View } from '../../enterprise/entities/view'

export interface Count {
  sellerId: string
  productId?: string
  from?: Date
}

export interface ViewsPerDay {
  date: Date
  amount: number
}

export interface ViewsRepository {
  count(params: Count): Promise<number>
  countPerDay(params: Count): Promise<ViewsPerDay[]>
  findById(id: string): Promise<View | null>
  isViewed(view: View): Promise<boolean>
  create(view: View): Promise<View>
}
