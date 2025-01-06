import {
  Count,
  ViewsRepository,
} from '@/domain/marketplace/application/repositories/views-repository'
import { View } from '@/domain/marketplace/enterprise/entities/view'
import { normalizeDate } from 'test/utils/normalizeDate'

export class InMemoryViewsRepository implements ViewsRepository {
  public items: View[] = []

  async count({ sellerId, productId, from }: Count) {
    let filteredViews = this.items

    filteredViews = filteredViews.filter((view) => {
      return (
        (!productId || view.product.id.toString() === productId) &&
        (!from || view.createdAt >= from) &&
        view.product.ownerId.toString() === sellerId
      )
    })

    return filteredViews.length
  }

  async countPerDay({
    sellerId,
    from = new Date(new Date().setDate(new Date().getDate() - 30)),
  }: Count) {
    let filteredViews = this.items

    filteredViews = filteredViews.filter((view) => {
      return (
        view.createdAt >= normalizeDate(from) &&
        view.product.ownerId.toString() === sellerId
      )
    })

    const groupedViews = filteredViews.reduce(
      (acc, view) => {
        const dateKey = normalizeDate(view.createdAt)
          .toISOString()
          .split('T')[0]

        acc[dateKey] = (acc[dateKey] || 0) + 1

        return acc
      },
      {} as Record<string, number>,
    )

    const allDays: string[] = []
    const now = normalizeDate(new Date())
    const diffInDays = Math.floor(
      (now.getTime() - normalizeDate(from).getTime()) / (1000 * 3600 * 24),
    )

    for (let i = diffInDays; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)

      allDays.push(date.toISOString().split('T')[0])
    }

    const viewsPerDay = allDays.map((day) => ({
      date: new Date(day),
      amount: groupedViews[day] || 0,
    }))

    return viewsPerDay
  }

  async findById(id: string) {
    const view = this.items.find((item) => item.id.toString() === id)

    if (!view) {
      return null
    }

    return view
  }

  async isViewed({
    viewer: { id: viewerId },
    product: { id: productId },
  }: View): Promise<boolean> {
    return this.items.some(
      (item) =>
        item.product.id.toString() === productId.toString() &&
        item.viewer.id.toString() === viewerId.toString(),
    )
  }

  async create(view: View) {
    this.items.push(view)

    return view
  }
}
