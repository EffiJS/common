import { splitPath } from './utils';
import { IDataValue, TKey } from './types';
import { keys } from 'ramda';

export class Data {
  protected readonly data: IDataValue;

  constructor(initial: IDataValue) {
    this.data = {
      ...(initial || {}),
    };
  }

  init = initial => {
    if (!initial) {
      return;
    }
    if (Object.keys(this.data).length) {
      return;
    }

    Object.entries(JSON.parse(JSON.stringify(initial))).forEach(([key, value]) => {
      this.data[key] = value;
    });
  };

  clean = () => {
    const { data } = this;
    Object.keys(data).forEach(key => {
      if (data.hasOwnProperty(key)) {
        delete data[key];
      }
    });
  };

  all = (): IDataValue => JSON.parse(JSON.stringify(this.data));

  get = (key: TKey): any => {
    if (this.data.hasOwnProperty(key)) {
      return this.data[key];
    }
    const keys = splitPath(key);
    const res = keys.reduce((r, k) => (r ? r[k] : r), this.data);
    return res;
  };

  set = (key: TKey, value: any) => {
    if (this.data.hasOwnProperty(key)) {
      this.data[key] = value;
      return;
    }

    const keys = splitPath(key);
    const lastKey = keys.pop();
    const o = keys.reduce((r, k) => {
      if (!r.hasOwnProperty(k)) {
        r[k] = {};
      }
      return r[k];
    }, this.data);

    o[lastKey] = value;
  };

  delete = (key: TKey) => {
    if (this.data.hasOwnProperty(key)) {
      delete this.data[key];
      return;
    }

    const keys = splitPath(key);
    const lastKey = keys.pop();
    const o = keys.reduce((r, k) => {
      if (!r.hasOwnProperty(k)) {
        r[k] = {};
      }
      return r[k];
    }, this.data);

    delete o[lastKey];
  };
}
