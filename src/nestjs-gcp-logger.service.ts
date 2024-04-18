import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Log, Logging, LogSync } from '@google-cloud/logging';
import { google } from '@google-cloud/logging/build/protos/protos';
import { GCPLoggerModuleOptions } from './nestjs-gcp-logger-module.options';
import { MODULE_OPTIONS_TOKEN } from './nestjs-gcp-logger.module-definition';
import { Request } from 'express';
import LogSeverity = google.logging.type.LogSeverity;

@Injectable()
export class GCPLoggerService implements LoggerService {
  private readonly resource: { type: string, labels?: { [key: string]: string } } = { type: 'global' };
  private readonly logName!: string;
  private readonly gcpProjectId!: string;
  private readonly gcpLogging!: Logging;
  private readonly gcpLogger!: Log | LogSync;

  public req?: Request;
  public performanceStart?: number;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: GCPLoggerModuleOptions) {
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
    this.writeLog(LogSeverity.INFO, message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.writeLog(LogSeverity.WARNING, message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): any {
    this.writeLog(LogSeverity.DEBUG, message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): any {
    this.writeLog(LogSeverity.ERROR, message, optionalParams);
  }

  private writeLog(
    severity: LogSeverity,
    message: any,
    ...optionalParams: any[]
  ): void {
    const componentName = optionalParams[0].pop() as string;
    const metadata = {
      severity,
      labels: {
        component: componentName,
        ...{ ...optionalParams[0] }
      },
      resource: this.resource
    } as any;

    if (this.req) {
      metadata.httpRequest = this.req;
      metadata.latency = `${(performance.now() - this.performanceStart) / 1000}s`;
    }
    const json_Entry = this.gcpLogger.entry(metadata, message);
    this.gcpLogger.write(json_Entry);
  }
}
