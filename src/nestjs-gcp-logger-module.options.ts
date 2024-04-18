export interface GCPLoggerModuleOptions {
  projectId: string;
  logName: string;
  /**
   * If you're using a Cloud Native app (like Cloud Run)
   * it should be not true.
   */
  isAsyncLogger?: boolean;
  /**
   * Default is 'global'
   * You can find more options here:
   * https://cloud.google.com/logging/docs/reference/v2/rest/v2/MonitoredResource
   */
  resourceType?: string;
  /**
   * More info here: https://cloud.google.com/logging/docs/reference/v2/rest/v2/MonitoredResource
   */
  resourceLabels?: { [key: string]: string };
}
