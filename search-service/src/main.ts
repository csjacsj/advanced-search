import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // 只允许这个域名跨域
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    //
  })
  .catch((e) => {
    console.error('Error starting server:', e);
    process.exit(1);
  });
