import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { env } from 'node:process';
import { Log, Logging, LogSync } from '@google-cloud/logging';
import { readFileSync } from 'node:fs';
import { google } from '@google-cloud/logging/build/protos/protos';
import { GCPLoggerModuleOptions } from './nestjs-gcp-logger-module.options';
import { MODULE_OPTIONS_TOKEN } from './nestjs-gcp-logger.module-definition';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import LogSeverity = google.logging.type.LogSeverity;

@Injectable()
export class GCPLoggerService implements LoggerService {
  public req?: Request;
  public performanceStart?: number;
  // https://cloud.google.com/logging/docs/reference/v2/rest/v2/MonitoredResource
  private readonly resource = { type: 'cloud_run_revision' } as const;
  // https://cloud.google.com/run/docs/container-contract#env-vars
  private readonly projectIdPath = '/computeMetadata/v1/project/project-id';
  // https://cloud.google.com/run/docs/container-contract#env-vars
  private readonly logName!: string;
  private readonly gcpProjectId!: string;
  private readonly gcpLogging!: Logging;
  private readonly gcpLogger!: Log | LogSync;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: GCPLoggerModuleOptions) {
    try {
      this.logName = env.K_SERVICE || options.logName;
      this.gcpProjectId = readFileSync(this.projectIdPath, {
        encoding: 'utf8'
      });
    } catch (_) {
      this.gcpProjectId = options.projectId;
    }
    this.gcpLogging = new Logging({ projectId: this.gcpProjectId });
    this.gcpLogger = this.gcpLogging.logSync(this.logName);
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

  private constructTrace(): string {
    const xTraceContextId = this.req.headers['x-trace-context-id'];
    return `projects/${this.gcpProjectId}/traces/${xTraceContextId}`;
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
        params: { ...optionalParams[0] }
      },
      resource: this.resource
    } as any;

    if (this.req) {
      metadata.httpRequest = {
        requestMethod: this.req.method,
        requestUrl: this.req.url,
        protocol: this.req.headers['x-forwarded-proto'] || uuidv4(),
      };
      metadata.latency = performance.now() - this.performanceStart;
      metadata.trace = this.constructTrace();
    }
    const json_Entry = this.gcpLogger.entry(metadata, message);
    this.gcpLogger.write(json_Entry);
  }
}
