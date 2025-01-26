# nestjs-gcp-logger

![XKCD 2863](https://imgs.xkcd.com/comics/space_typography.png)

[![npm version](https://badge.fury.io/js/@tazgr%2Fnestjs-gcp-logger.svg)](https://badge.fury.io/js/@tazgr%2Fnestjs-gcp-logger)

It's a simple logger that is compatible with Google Cloud Logging https://cloud.google.com/logging?hl=en and https://cloud.google.com/products/operations?hl=en (aka tracing).

It should be plug and play when using a native service like Cloud Run.

## Installation

`npm install --save @tazgr/nestjs-gcp-logger`

## Usage

Basic

You must assign `GCPLoggerService` in your `main.ts` `bootstrap()` method.
If it's not setup you will get the default logs/logger.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule.register(), {
    bufferLogs: true, // Starts writing when flushLogs is called.
    abortOnError: true, // Propagates throws
    logger: false, // So it doesn't use the normal console logger at all.
  });
  app.useLogger(app.get(GCPLoggerService));
  app.flushLogs();
  await app.listen(3000);
}
```

In your `app.module.ts` file add:
(this is a good sample for Cloud Run :) )

```typescript
import { Module } from '@nestjs/common';
import { GCPLoggingModule } from '@tazgr/nestjs-gcp-logger';
import { env } from 'node:env';

@Module({
  imports: [GCPLoggingModule.register({
    isGlobal: true, // NestJS Global Module... I recommend leaving it true.
    projectId: 'your-project-id-from-gcp',
    logName: env.K_SERVICE,
    // https://cloud.google.com/run/docs/container-contract#env-vars
    // Use this is you are running some non Cloud Native apps like Compute Engine
    // or from external host provider (other than Google)
    // false means it will write the logs in stdout.
    isAsyncLogger: false,
    resourceType: 'cloud_run_revision',
    resourceLabels: {
      service_name: env.K_SERVICE,
      revision_name: env.K_REVISION,
      location: 'eu-west1',
      configuration_name: env.K_CONFIGURATION,
    }
  })]
})
export class AppModule {}
```

There is also a typical `registerAsync` version to inject config services etc...

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GCPLoggingModule } from '@tazgr/nestjs-gcp-logger';

@Module({
  imports: [
    ConfigModule.forRoot({ ... }),
    GCPLoggingModule.registerAsync({
      inject: [ConfigService], // or something else, you do you
      useFactory: (config: ConfigService) => {
        const projectId = config.get<string>('PROJECT_ID_OR_WHATEVER');
        const logName = config.get<string>('LOGNAME_OR_WHATEVER');
        return {
          global: true,
          projectId,
          logName,
          isAsyncLogger: false,
        }
      }
    })
  ]
})
export class AppModule {}
```

Enjoy!

# Links
Inspiration for how to fill value in the configuration
- https://cloud.google.com/logging/docs/reference/v2/rest/v2/MonitoredResource
- https://cloud.google.com/run/docs/container-contract#env-vars
