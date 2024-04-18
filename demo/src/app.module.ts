import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GCPLoggingModule } from '@tazgr/nestjs-gcp-logger';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        GCPLoggingModule.register({
          isGlobal: true,
          projectId: 'default-project-id',
          logName: 'my-app-api',
          isAsyncLogger: false,
          resourceType: 'global',
          resourceLabels: {
            my: 'label',
          }
        })
      ],
      controllers: [AppController],
      providers: [AppService]
    };
  }
}
