import { Controller, Get, Ip, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestAsyncStoreService } from '@tazgr/nestjs-gcp-logger';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly cls: RequestAsyncStoreService,
  ) {}

  @Get()
  getHello(@Ip() ip: string): string {
    this.logger.log(`Request on GET / from ${ip}.`);
    this.cls.set('labels', { ip });
    this.logger.log(`With IP in label!`);
    return this.appService.getHello();
  }
}
