import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: true, // 모든 도메인 허용. 특정 도메인만 허용하려면 'http://example.com' 같이 문자열이나 배열로 지정
    credentials: true, // 자격증명(쿠키 등) 허용
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
