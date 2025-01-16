import {
  Count,
  FindMany,
  FindManyByOwner,
  ProductsRepository,
} from '@/domain/marketplace/application/repositories/products-repository'
import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { normalizeDate } from 'test/utils/normalizeDate'
import { InMemorySellersRepository } from './in-memory-sellers-repository'
import { InMemoryProductAttachmentsRepository } from './in-memory-product-attachments-repository'
import { InMemoryCategoriesRepository } from './in-memory-categories-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { ProductDetails } from '@/domain/marketplace/enterprise/entities/value-objects/product-details'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  constructor(
    private productAttachmentsRepository: InMemoryProductAttachmentsRepository,
    private sellersRepository: InMemorySellersRepository,
    private categoriesRepository: InMemoryCategoriesRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
  ) {}

  async count({ sellerId, status, from }: Count) {
    let filteredProducts = this.items

    const normalizedFrom = from ? normalizeDate(from) : null

    filteredProducts = filteredProducts.filter((product) => {
      const productStatusAt = normalizeDate(product.statusAt)

      return (
        product.ownerId.toString() === sellerId &&
        (!status || product.status.toString() === status) &&
        (!from || productStatusAt >= normalizedFrom!)
      )
    })

    return filteredProducts.length
  }

  async findById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findDetailsById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    const owner = await this.sellersRepository.findWithAvatarById(
      product.ownerId.toString(),
    )

    if (!owner) {
      throw new Error(
        `owner with ID "${product.ownerId.toString()}" does not exist.`,
      )
    }

    const category = this.categoriesRepository.items.find((category) => {
      return category.id.equals(product.categoryId)
    })

    if (!category) {
      throw new Error(
        `category with ID "${product.categoryId.toString()}" does not exist.`,
      )
    }

    const productAttachments = this.productAttachmentsRepository.items.filter(
      (productAttachment) => {
        return productAttachment.productId.equals(product.id)
      },
    )

    const attachments = productAttachments.map((productAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(productAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${productAttachment.attachmentId.toString()}" does not exist.`,
        )
      }

      return attachment
    })

    return ProductDetails.create({
      productId: product.id,
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      owner,
      category,
      attachments,
      createdAt: product.createdAt,
      statusAt: product.statusAt,
    })
  }

  async findManyByOwner({ ownerId, search, status }: FindManyByOwner) {
    let filteredProducts = this.items

    filteredProducts = filteredProducts.filter(
      (product) => product.ownerId.toString() === ownerId,
    )

    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.includes(search) ||
          product.description.includes(search),
      )
    }

    if (status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === status,
      )
    }

    const products = filteredProducts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    return products
  }

  async findManyWithDetailsByOwner({
    ownerId,
    search,
    status,
  }: FindManyByOwner) {
    let filteredProducts = this.items

    filteredProducts = filteredProducts.filter(
      (product) => product.ownerId.toString() === ownerId,
    )

    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.includes(search) ||
          product.description.includes(search),
      )
    }

    if (status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === status,
      )
    }

    const products = filteredProducts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    const owner = await this.sellersRepository.findWithAvatarById(ownerId)

    if (!owner) {
      throw new Error(`owner with ID "${ownerId}" does not exist.`)
    }

    const productsWithDetails = products.map((product) => {
      const category = this.categoriesRepository.items.find((category) => {
        return category.id.equals(product.categoryId)
      })
      console.log(category)
      if (!category) {
        throw new Error(
          `category with ID "${product.categoryId.toString()}" does not exist.`,
        )
      }

      const productAttachments = this.productAttachmentsRepository.items.filter(
        (productAttachment) => {
          return productAttachment.productId.equals(product.id)
        },
      )

      const attachments = productAttachments.map((productAttachment) => {
        const attachment = this.attachmentsRepository.items.find(
          (attachment) => {
            return attachment.id.equals(productAttachment.attachmentId)
          },
        )

        if (!attachment) {
          throw new Error(
            `Attachment with ID "${productAttachment.attachmentId.toString()}" does not exist.`,
          )
        }

        return attachment
      })

      return ProductDetails.create({
        productId: product.id,
        title: product.title,
        description: product.description,
        priceInCents: product.priceInCents,
        status: product.status,
        owner,
        category,
        attachments,
        createdAt: product.createdAt,
        statusAt: product.statusAt,
      })
    })

    return productsWithDetails
  }

  async findMany({ page, search, status }: FindMany) {
    let filteredProducts = this.items

    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.includes(search) ||
          product.description.includes(search),
      )
    }

    if (status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === status,
      )
    }

    const products = filteredProducts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return products
  }

  async save(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id)

    this.items[itemIndex] = product

    await this.productAttachmentsRepository.createMany(
      product.attachments.getNewItems(),
    )

    await this.productAttachmentsRepository.deleteMany(
      product.attachments.getRemovedItems(),
    )
  }

  async create(product: Product) {
    this.items.push(product)

    await this.productAttachmentsRepository.createMany(
      product.attachments.getItems(),
    )
  }
}
