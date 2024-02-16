import { IErrorValue, TKey } from './types';

export class Error {
  protected readonly error: IErrorValue = {};

  all = (): any => JSON.parse(JSON.stringify(this.error));

  get = (key: TKey): any => this.error[key];

  set = (key: TKey, value: any) => {
    this.error[key] = value;
  };

  clear = (key: TKey) => {
    if (this.error[key]) {
      delete this.error[key];
      return true;
    }
    return false;
  };
}
