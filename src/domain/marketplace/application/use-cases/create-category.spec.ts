import { CreateCategoryUseCase } from './create-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to create a category', async () => {
    const { category } = await sut.execute({
      title: 'Nova categoria',
    })

    expect(category.id).toBeTruthy()
    expect(inMemoryCategoriesRepository.items[0].id).toEqual(category.id)
  })
})
