import { Controller, Get, Ip, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Ip() ip: string): string {
    this.logger.log(`Request on GET / from ${ip}.`);
    return this.appService.getHello();
  }
}
