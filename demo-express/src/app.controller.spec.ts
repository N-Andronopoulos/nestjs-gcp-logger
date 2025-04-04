import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from 'node:process';
import { ClsModule, ClsService } from 'nestjs-cls';
import { RequestAsyncStoreService } from '@tazgr/nestjs-gcp-logger';

describe('AppController', () => {
  let appController: AppController;
  let cls: RequestAsyncStoreService;
  env.NODE_ENV = 'test';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ClsModule],
    }).compile();

    appController = app.get<AppController>(AppController);
    cls = app.get<RequestAsyncStoreService>(ClsService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const resp = cls.runWith({}, () => appController.getHello('1.1.1.1'));
      expect(resp).toBe('Hello World!');
    });
  });
});
