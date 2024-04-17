import { Injectable, NestMiddleware } from '@nestjs/common';
import { GCPLoggerService } from '@tazgr/nestjs-gcp-logger/nestjs-gcp-logger.service';
import { Request, Response } from 'express';

@Injectable()
export class GCPLoggerMiddleware implements NestMiddleware {
  constructor(private logger: GCPLoggerService) {}

  use(req: Request, _res: Response, next: (error?: any) => void): any {
    this.logger.performanceStart = performance.now();
    this.logger.req = req;
    req.on('close', () => this.logger.req = null);
    next();
  }
}
