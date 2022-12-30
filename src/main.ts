import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-PINGOTHER, Content-Type',
    origin: 'http://127.0.0.1:5173'
  })
  await app.listen(parseInt(process.env.PORT)  || 8080)
}

bootstrap()
