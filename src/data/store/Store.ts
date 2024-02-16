import { Data, splitPath, TKey } from '@data/core';
import { EffiError } from '@error';
import { normalize } from './normalize';

interface Listener {
  handle: (data: any) => void;
  keys: {
    [path: string]: string | undefined | null;
  };
}

type TSetListItemOptions = {
  removeIfExist: boolean;
  itemKey: string;
};

export class Store {
  protected readonly data: Data;

  private readonly listeners = {
    $tree: {},
  };

  constructor(initial: any) {
    this.data = new Data(initial);
  }

  public get(key: TKey | (TKey | { [alias: string]: TKey })[]): any {
    if (Array.isArray(key)) {
      const { data } = this;
      return key.reduce((r, k) => {
        if (typeof k === 'object') {
          Object.entries(k).forEach(([alias, key]) => {
            r[alias] = data.get(key);
          });
        } else if (typeof k === 'string' || typeof k === 'number') {
          // @ts-ignore
          r[k] = data.get(k);
        }
        return r;
      }, {});
    }
    return this.data.get(key);
  }

  public setListItem(name, item, opt: TSetListItemOptions) {
    const list = this.get(name);

    if (!list) {
      return this.set(name, [item]);
    }

    if (opt.removeIfExist) {
      const index = list.findIndex(element =>
        opt.itemKey ? element[opt.itemKey] === item[opt.itemKey] : element === item,
      );

      if (index >= 0) {
        list.splice(index, 1);
        return this.set(name, [...list]);
        // return this.delete(`${name}.${index}`);
      }
    }

    this.set(name, [...list, item]);
  }

  public set(name, data) {
    this.data.set(name, data);

    /* if (merge) {
      const stored = data.get(name);
      data.set(name, mergeDeepRight(stored, data));
    } else {
      data.set(name, data);
    } */

    const keyOfTree = splitPath(name).reduce((p, key) => {
      if (!p?.[key]) {
        return null;
      }

      this.callListeners(p[key].$);

      return p[key];
    }, this.listeners.$tree);

    if (keyOfTree) {
      this.search(keyOfTree, true);
    }
  }

  public delete(name) {
    this.data.delete(name);

    // TODO: Check child subscriptions and remove them
  }

  public clean() {
    this.data.clean();
  }

  /**
     keys - array of strings or array of object with alias keys
     */
  public subscribe(keys, handle) {
    if (!Array.isArray(keys)) {
      throw new EffiError('Store:Subscribe: keys must be arrays of strings');
    }

    const normalized: { [key: string]: any } = {};
    normalize(keys, normalized);

    const toClear = Object.keys(normalized).map(path => {
      if (!this.listeners[path]) {
        this.listeners[path] = {
          $index: 0,
        };
      }
      this.listeners[path].$index += 1;
      const index = this.listeners[path].$index;
      const data = {
        handle(...args) {
          handle(...args);
        },
        keys: normalized,
      };
      // listeners[path][index] = data;

      const keyOfTree = splitPath(path).reduce((p, key) => {
        if (!p[key]) {
          p[key] = {
            $: {},
          };
        }
        return p[key];
      }, this.listeners.$tree);

      keyOfTree.$[index] = data;

      return [path, index, keyOfTree.$];
    });

    const data = Object.entries(normalized).reduce((r, [path, alias]) => {
      r[alias] = this.data.get(path);
      return r;
    }, {});

    handle(data);

    return () => {
      toClear.forEach(([key, index, tree]) => {
        delete this.listeners[key][index];
        delete tree[index];
      });
    };
  }

  private search(tree, ignore = false) {
    Object.entries(tree).forEach(([key, branch]) => {
      if (key === '$') {
        if (!ignore) {
          this.callListeners(branch);
        }
      } else if (branch) {
        this.search(branch);
      }
    });
  }

  private callListeners(listeners) {
    Object.values(listeners).forEach((listener: Listener) => {
      if (!listener || typeof listener !== 'object' || !listener.hasOwnProperty('handle')) {
        return;
      }
      const { handle, keys } = listener;
      const keysData = Object.entries(keys).reduce((r, [p, a]) => {
        r[a] = this.data.get(p);
        return r;
      }, {});
      if (typeof handle === 'function') {
        handle(keysData);
      }
    });
  }
}
