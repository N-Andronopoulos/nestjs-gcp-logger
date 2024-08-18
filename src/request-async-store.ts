import { ClsStore, Terminal } from 'nestjs-cls';
import { Request } from 'express';

export interface RequestAsyncStore extends ClsStore {
  request: Terminal<Request>;
  startTime: number;
  labels: Terminal<{ [key: string]: string }>;
}
