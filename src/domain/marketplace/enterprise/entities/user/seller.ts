import { User, UserProps } from './user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SellerProps extends UserProps {}

export class Seller extends User<SellerProps> {
  static create(props: SellerProps, id?: UniqueEntityID) {
    const seller = new Seller(
      {
        ...props,
      },
      id,
    )

    return seller
  }
}
