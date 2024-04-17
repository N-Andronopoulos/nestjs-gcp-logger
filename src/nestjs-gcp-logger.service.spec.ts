import { Test, TestingModule } from '@nestjs/testing';
import { GCPLoggerService } from './nestjs-gcp-logger.service';
import { MODULE_OPTIONS_TOKEN } from './nestjs-gcp-logger.module-definition';

describe('NestjsGcpLoggerService', () => {
  let service: GCPLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GCPLoggerService,
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: {
            project: 'test-id',
            logName: 'test-app'
          }
        }
      ]
    }).compile();

    service = module.get<GCPLoggerService>(GCPLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
