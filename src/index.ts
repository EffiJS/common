import 'reflect-metadata';
import './utils/string';
import { Instance } from '@common';

export * as api from './api';
export * as common from './common';
export * as controller from './controller';
export * as data from './data';
export * as module from './module';
export * as service from './service';

type TModules<T> = new (...modules: any[]) => T;

export class EffiJS {
  static create<T>(main: TModules<T>): T {
    return Instance.get(main);
  }
}

export { Instance };
