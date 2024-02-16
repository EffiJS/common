import { EffiError } from '@error';
import { Data } from './data';
import { Error } from './error';
import { Event } from './event';
import { Validator } from './validator';
import { IDataValue, IStorageRepository, TFunctionNoArgs } from './types';
import { EVENT } from './consts';
import { splitPath } from '@data/core/utils';

function init(initialData: IDataValue): IStorageRepository {
  const data = new Data(initialData);
  const error = new Error();
  const event = new Event();

  const res: IStorageRepository = {
    value: {
      all: data.all,
      get: data.get,
      set(key, value) {
        error.clear(key);
        // TODO: (25.09) clear parent keys
        const keys = splitPath(key);
        if (keys.length > 1) {
          keys.pop();
          keys.reduce(function (r, k) {
            r = r + (r ? '.' : '') + k;
            error.clear(r);
            event.notify(r, function (_, onError) {
              onError?.(error.get(r));
            });
            return r;
          }, '');
        }

        data.set(key, value);
        event.notify(key, (onChange, onError) => {
          onChange?.(data.get(key));
          onError?.(error.get(key));
        });
        // TODO: (25.09) notify parent keys

        event.notify(EVENT.DATA, (onChange, onError) => {
          onChange?.(data.all());
          onError?.(error.all());
        });
      },
      addListItem(key, initial?) {
        const list = data.get(key);
        const updated = list && Array.isArray(list) ? [...list, initial] : [initial];
        res.value.set(key, updated);
      },
      removeListItem(key, index) {
        const list = data.get(key);
        if (Array.isArray(list)) {
          list.splice(index, 1);
          res.value.set(key, [...list]);
        }
      },
    },
    error: {
      all: error.all,
      get: error.get,
      set: error.set,
      clear: error.clear,
    },
    event: {
      addListener(key, initial, onChangeHandle, onErrorHandle?): TFunctionNoArgs {
        const destroyHandle = event.addListener(key, onChangeHandle, onErrorHandle);
        const v = data.get(key);

        if (v) {
          onChangeHandle(v);
        } else if (initial) {
          // TODO: Need  to see how it is used in project
          data.set(key, initial);
          onChangeHandle(initial);
        }

        return destroyHandle;
      },
      notify: event.notify,
    },
  };

  return res;
}

export class Storage {
  private static readonly storage: { [key: string]: Storage } = {};

  static destroy(validator) {
    const name = Validator.getName(validator);

    if (!Storage.storage?.[name]) {
      throw new EffiError(`Storage is not defined by name "${name}"`);
    }

    delete Storage.storage[name];
  }

  static get $$storage() {
    return Storage.storage;
  }

  static validate(validator) {
    const name = Validator.getName(validator);

    const storage = Storage.storage?.[name];

    if (!storage) {
      throw new EffiError(`Storage is not defined by name "${name}"`);
    }

    return storage.validate();
  }

  protected readonly $repository: IStorageRepository;

  protected readonly $validator: Validator<any>;

  protected readonly $name: string;

  constructor(initial: IDataValue, validator) {
    this.$repository = init(initial);
    this.$validator = new Validator(validator);
    this.$name = Validator.getName(validator);

    Storage.storage[this.$name] = this;
  }

  get value() {
    return this.$repository.value;
  }

  get error() {
    return this.$repository.error;
  }

  get event() {
    return this.$repository.event;
  }

  validate = () => {
    const { error, validated } = this.$validator.validate(this.$repository.value.all());

    if (!Object.keys(error || {}).length) {
      const prevErrors = this.$repository.error.all();
      Object.keys(prevErrors).forEach(key => {
        this.$repository.error.clear(key);
        this.$repository.event.notify(key, (_, onError) => onError?.(null));
      });

      this.$repository.event.notify(EVENT.DATA, (_, onError) =>
        onError?.(this.$repository.error.all()),
      );

      return { data: validated };
    }

    Object.entries(error).forEach(([key, e]) => {
      this.$repository.error.set(key, e);
      this.$repository.event.notify(key, (_, onError) => onError?.(e));
    });
    this.$repository.event.notify(EVENT.DATA, (_, onError) =>
      onError?.(this.$repository.error.all()),
    );

    return { error };
  };

  destroy = () => {
    delete Storage.storage[this.$name];
  };
}
