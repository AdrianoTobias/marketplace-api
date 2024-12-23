import { ViewsRepository } from '@/domain/marketplace/application/repositories/views-repository'
import { View } from '@/domain/marketplace/enterprise/entities/view'

export class InMemoryViewsRepository implements ViewsRepository {
  public items: View[] = []

  async findById(id: string) {
    const view = this.items.find((item) => item.id.toString() === id)

    if (!view) {
      return null
    }

    return view
  }

  async isViewed({ productId, viewerId }: View): Promise<boolean> {
    return this.items.some(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.viewerId.toString() === viewerId.toString(),
    )
  }

  async create(view: View) {
    this.items.push(view)

    return view
  }
}
