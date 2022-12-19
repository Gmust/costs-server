import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-PINGOTHER, Content-Type',
    origin: 'http://127.0.0.1:5173'
  })
  await app.listen(8080)
}

bootstrap()
