import { Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const createProductBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInCents: z.number(),
  categoryId: z.string().uuid(),
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
export class CreateProductController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateProductBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, categoryId, description, priceInCents, attachmentsIds } =
      body
    const userId = user.sub
    const status = 'available'

    await this.prisma.product.create({
      data: {
        ownerId: userId,
        title,
        description,
        priceInCents,
        status,
        categoryId,
        // attachments: attachmentsIds,
        attachments: {
          connect: attachmentsIds.map((id) => ({ id })),
        },
      },
    })
  }
}
