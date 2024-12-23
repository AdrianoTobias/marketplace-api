import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { View, ViewProps } from '@/domain/marketplace/enterprise/entities/view'

export function makeView(
  override: Partial<ViewProps> = {},
  id?: UniqueEntityID,
) {
  const view = View.create(
    {
      productId: new UniqueEntityID(),
      viewerId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return view
}
