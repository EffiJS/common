import { TKey } from './types';

const reg = /^(.{1,})\[(\d{1,})\]$/i;

export function splitPath(path: TKey): Array<TKey> {
  if (typeof path === 'number') {
    return [path];
  }

  return path.split('.').reduce((res, key) => {
    if (reg.test(key)) {
      // const { '1': k1, '2': k2 } = reg.exec(key);
      const r = reg.exec(key);
      res.push(r?.[1], r?.[2]);
    } else {
      res.push(key);
    }
    return res;
  }, []);
}
