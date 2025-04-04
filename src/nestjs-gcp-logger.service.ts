import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Log, Logging, LogSync } from '@google-cloud/logging';
import { GCPLoggerModuleOptions } from './nestjs-gcp-logger-module.options';
import { GCP_LOG_MODULE_OPTIONS } from './nestjs-gcp-logger.module-definition';
import { ClsService } from 'nestjs-cls';
import { RequestAsyncStore } from './request-async-store';
import { LogEntry } from '@google-cloud/logging/build/src/entry';

type LogSeverity = 'INFO' | 'WARNING' | 'DEBUG' | 'ERROR' | 'CRITICAL';

@Injectable()
export class GCPLoggerService implements LoggerService {
  private readonly resource: { type: string; labels?: { [key: string]: string } } = { type: 'global' };
  private readonly logName!: string;
  private readonly gcpProjectId!: string;
  private readonly gcpLogging!: Logging;
  private readonly gcpLogger!: Log | LogSync;

  constructor(
    @Inject(GCP_LOG_MODULE_OPTIONS) readonly options: GCPLoggerModuleOptions,
    private readonly cls: ClsService<RequestAsyncStore>,
  ) {
    this.logName = options.logName;
    this.gcpProjectId = options.projectId;
    if (options.resourceType) this.resource.type = options.resourceType;
    if (options.resourceLabels) this.resource.labels = options.resourceLabels;
    this.gcpLogging = new Logging({ projectId: this.gcpProjectId });
    if (options.isAsyncLogger) {
      this.gcpLogger = this.gcpLogging.log(this.logName);
    } else {
      this.gcpLogger = this.gcpLogging.logSync(this.logName);
    }
  }

  log(message: any, ...optionalParams: any[]): any {
    this.writeLog('INFO', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.writeLog('WARNING', message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): any {
    this.writeLog('DEBUG', message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): any {
    this.writeLog('ERROR', message, optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]): any {
    this.writeLog('CRITICAL', message, optionalParams);
  }

  private writeLog(severity: LogSeverity, message: any, ...optionalParams: any[]): void {
    const componentName = optionalParams[0].pop() as string;
    const metadata = {
      severity,
      labels: {
        component: componentName,
        ...{ ...optionalParams[0] },
      },
      resource: this.resource,
    } as Partial<LogEntry>;

    if (this.cls.isActive()) {
      // Get from Node's asynchronous execution context.
      // https://nodejs.org/api/async_context.html#asynclocalstoragegetstore
      // https://docs.nestjs.com/recipes/async-local-storage#nestjs-cls
      const { request, startTime, labels = {}, traceId, spanId, traceSampled } = this.cls.get();

      // region tracing
      if (traceId) {
        metadata.trace = `projects/${this.gcpProjectId}/traces/${traceId}`;
      }
      if (spanId) {
        metadata.spanId = spanId;
      }
      if (typeof traceSampled === 'boolean') {
        metadata.traceSampled = traceSampled;
      }
      // endregion

      // Set request context
      metadata.httpRequest = {
        requestMethod: request.method,
        requestUrl: `${request.headers['x-forwarded-proto'] || 'http'}://${request.headers['host']}${request.originalUrl}`,
        requestSize: request.headers['content-length'],
        userAgent: request.headers['user-agent'],
        remoteIp: request.ip,
        serverIp: request.socket?.localAddress,
        referer: (request.headers['referer'] || request.headers['referrer']) as string,
        protocol: (request.headers['x-forwarded-proto'] || request.protocol) as string,
        latency: { seconds: (performance.now() - startTime) / 1000 },
      };
      metadata.labels = { ...metadata.labels, ...labels };
    }
    const json_Entry = this.gcpLogger.entry(metadata, message);
    this.gcpLogger.write(json_Entry);
  }
}
