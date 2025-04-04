import { ConfigurableModuleBuilder } from '@nestjs/common';
import { GCPLoggerModuleOptions } from './nestjs-gcp-logger-module.options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: GCP_LOG_MODULE_OPTIONS } =
  new ConfigurableModuleBuilder<GCPLoggerModuleOptions>()
    .setExtras({ isGlobal: true }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .build();
