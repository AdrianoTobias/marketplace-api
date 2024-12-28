import { Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const queryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((value) => {
      const numberValue = Number(value)
      if (isNaN(numberValue)) {
        throw new Error('Page must be a valid number')
      }
      return numberValue
    })
    .pipe(z.number().min(1, { message: 'Page must be at least 1' })),
  search: z.string().optional(),
  status: z.string().optional(),
})

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type QueryParamSchema = z.infer<typeof queryParamSchema>

@Controller('/products')
export class FetchRecentProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query(queryValidationPipe)
    { page, search, status }: QueryParamSchema,
  ) {
    const perPage = 3

    const products = await this.prisma.product.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(status ? { status } : {}),
      },
    })

    return { products }
  }
}
