import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GCPLoggerService } from '@tazgr/nestjs-gcp-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.register(), {
    bufferLogs: true, // Starts writing when flushLogs is called.
    abortOnError: true, // Propagates throws
    logger: false, // So it doesn't use the normal console logger at all.
  });
  app.useLogger(await app.resolve(GCPLoggerService));
  app.flushLogs();
  await app.listen(3000);
}

bootstrap();
