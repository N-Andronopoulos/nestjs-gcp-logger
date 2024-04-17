import { ConfigurableModuleBuilder } from '@nestjs/common';
import { GCPLoggerModuleOptions } from '@tazgr/nestjs-gcp-logger/nestjs-gcp-logger-module.options';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN
} = new ConfigurableModuleBuilder<GCPLoggerModuleOptions>()
  .setExtras(
    { isGlobal: true },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal
    })
  )
  .build();
