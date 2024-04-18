import { Injectable, NestMiddleware } from '@nestjs/common';
import { GCPLoggerService } from './nestjs-gcp-logger.service';
import { Request, Response } from 'express';

@Injectable()
export class GCPLoggerMiddleware implements NestMiddleware {
  constructor(private logger: GCPLoggerService) {}

  use(req: Request, res: Response, next: (error?: any) => void): any {
    this.logger.performanceStart = performance.now();
    this.logger.req = req;
    res.on('close', () => this.cleanupLogger(res))
    res.on('finish', () => this.cleanupLogger(res))
    res.on('error', () => this.cleanupLogger(res))
    next();
  }

  private cleanupLogger(res: Response) {
    this.logger.req = null;
    this.logger.performanceStart = null;
    res.removeListener('close', this.cleanupLogger);
    res.removeListener('finish', this.cleanupLogger);
    res.removeListener('error', this.cleanupLogger);
  }
}
