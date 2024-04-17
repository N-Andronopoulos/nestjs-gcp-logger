# nestjs-gcp-logger

![XKCD 2863](https://imgs.xkcd.com/comics/space_typography.png)


It's a simple logger that is compatible with Google Cloud Logging https://cloud.google.com/logging?hl=en and https://cloud.google.com/products/operations?hl=en (aka tracing).

It should be plug and play when using a native service like Cloud Run.

## Installation

`npm install --save @tazgr/nestjs-gcp-logger`

## Usage

Basic

In your `app.module.ts` file add:

```typescript
import { GCPLoggingModule } from './nestjs-gcp-logger.module';

@Module({
  imports: [GCPLoggingModule.register({
    projectId: 'your-project-id-from-gcp',
    // logName is a fallback it should be taken by:
    // https://cloud.google.com/run/docs/container-contract#env-vars
    // K_SERVICE	The name of the Cloud Run service being run.
    logName: 'your-application-name',
  })]
})
export class AppModule {}
```

There is also a typical `registerAsync` version to inject config services etc...

