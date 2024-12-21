import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ViewProps {
  viewerId: string
  productId: string
  createdAt: Date
}

export class View extends Entity<ViewProps> {
  get viewerId() {
    return this.props.viewerId
  }

  get productId() {
    return this.props.productId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<ViewProps, 'createdAt'>, id?: UniqueEntityID) {
    const view = new View(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return view
  }
}
