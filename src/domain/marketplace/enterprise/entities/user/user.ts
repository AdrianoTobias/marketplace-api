import { Entity } from '@/core/entities/entity'
import { Attachment } from '../attachment'

export interface UserProps {
  name: string
  phone: string
  email: string
  password: string
  avatar?: Attachment | null
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
  get name() {
    return this.props.name
  }

  get phone() {
    return this.props.phone
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get avatar() {
    return this.props.avatar
  }
}
