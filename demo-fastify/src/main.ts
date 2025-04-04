import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GCPLoggerService } from '@tazgr/nestjs-gcp-logger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule.register(), new FastifyAdapter(), {
    bufferLogs: true, // Starts writing when flushLogs is called.
    abortOnError: true, // Propagates throws
    logger: false, // So it doesn't use the normal console logger at all.
  });
  app.useLogger(app.get(GCPLoggerService));
  app.flushLogs();
  await app.listen(3001);
}

bootstrap();
