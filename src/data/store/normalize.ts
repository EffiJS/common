import { splitPath } from '@data/core';

export function normalize(keys: string | [] | object, res = {}) {
  if (!keys) {
    return;
  }

  if (typeof keys === 'string') {
    const alias = splitPath(keys).pop();
    res[keys] = alias;
  } else if (Array.isArray(keys)) {
    keys.forEach(key => normalize(key, res));
  } else if (typeof keys === 'object') {
    Object.entries(keys).forEach(([alias, path]) => {
      res[path] = alias;
    });
  }
}
