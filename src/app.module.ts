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
          projectId: 'default-project-id',
          logName: 'my-app-api'
        })
      ],
      controllers: [AppController],
      providers: [AppService]
    };
  }
}
