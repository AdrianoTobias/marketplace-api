import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permita apenas os métodos necessários
    credentials: true, // Permita envio de cookies ou credenciais, se necessário
  })

  app.use(cookieParser())

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
