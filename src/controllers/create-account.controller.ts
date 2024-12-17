import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'

@Controller('/sellers')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, phone, email, avatarId, password, passwordConfirmation } =
      body

    if (password !== passwordConfirmation) {
      throw new BadRequestException(
        'Password and confirmation password do not match.',
      )
    }

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    const userWithSamePhone = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    })

    if (userWithSamePhone) {
      throw new ConflictException('User with same phone number already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        phone,
        email,
        avatarId,
        password: hashedPassword,
      },
    })
  }
}
