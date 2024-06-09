import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GCPLoggerService } from '@tazgr/nestjs-gcp-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.register(), { bufferLogs: true });
  app.useLogger(await app.resolve(GCPLoggerService));
  await app.listen(3000);
}

bootstrap();
