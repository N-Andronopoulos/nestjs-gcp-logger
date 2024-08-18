import { Module, NestModule } from '@nestjs/common';
import { GCPLoggerService } from './nestjs-gcp-logger.service';
import { ConfigurableModuleClass } from './nestjs-gcp-logger.module-definition';
import { ClsModule, ClsService } from 'nestjs-cls';
import { RequestAsyncStore } from '@tazgr/nestjs-gcp-logger/request-async-store';

@Module({
  providers: [GCPLoggerService],
  imports: [
    // Register the ClsModule,
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls: ClsService<RequestAsyncStore>, req) => {
          cls.set('request', req);
          cls.set('startTime', performance.now());
          cls.set('labels', {});
        },
      },
    }),
  ],
  exports: [GCPLoggerService],
})
export class GCPLoggingModule extends ConfigurableModuleClass implements NestModule {}
