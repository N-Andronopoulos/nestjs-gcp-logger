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
      global: true,
      middleware: {
        mount: true,
        setup: (cls: ClsService<RequestAsyncStore>, req) => {
          cls.set('request', req);
          cls.set('startTime', performance.now());
          cls.set('labels', {});

          const traceContext = req.get('x-cloud-trace-context');
          if (traceContext) {
            // Trace Pattern TRACE_ID/SPAN_ID;o=OPTIONS
            // https://cloud.google.com/trace/docs/trace-context
            const [traceId, spanId, sampled] = traceContext.split(/[\/;]/);
            cls.set('traceId', traceId);
            if (spanId) cls.set('spanId', spanId);
            if (sampled) cls.set('traceSampled', sampled === 'o=1');
          }
        },
      },
    }),
  ],
  exports: [GCPLoggerService],
})
export class GCPLoggingModule extends ConfigurableModuleClass implements NestModule {}

