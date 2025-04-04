import { Test, TestingModule } from '@nestjs/testing';
import { GCPLoggerService } from './nestjs-gcp-logger.service';
import { GCP_LOG_MODULE_OPTIONS } from './nestjs-gcp-logger.module-definition';
import { ClsModule } from 'nestjs-cls';

describe('NestjsGcpLoggerService', () => {
  let service: GCPLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GCPLoggerService,
        {
          provide: GCP_LOG_MODULE_OPTIONS,
          useValue: {
            project: 'test-id',
            logName: 'test-app',
          },
        },
      ],
      imports: [ClsModule.forRoot()],
    }).compile();

    service = await module.resolve<GCPLoggerService>(GCPLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
