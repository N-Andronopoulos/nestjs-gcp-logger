import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GCPLoggerService } from './nestjs-gcp-logger.service';
import { GCPLoggerMiddleware } from './nestjs-gcp-logger.middleware';
import { ConfigurableModuleClass } from './nestjs-gcp-logger.module-definition';

@Module({
  providers: [GCPLoggerService],
  exports: [GCPLoggerService]
})
export class GCPLoggingModule extends ConfigurableModuleClass implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GCPLoggerMiddleware).forRoutes('*');
  }
}
