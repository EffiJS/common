import { values } from 'ramda';
import { IEventValue, TFunction, TFunctionNoArgs, TKey } from './types';

export class Event {
  protected readonly event: IEventValue = {};

  addListener = (
    key: TKey,
    onChangeHandle: TFunction,
    onErrorHandle?: TFunction,
  ): TFunctionNoArgs => {
    if (!this.event[key]) {
      this.event[key] = {
        index: 0,
      };
    }
    this.event[key].index += 1;
    const { index } = this.event[key];
    this.event[key][index] = {
      onChange: onChangeHandle,
      onError: onErrorHandle,
    };

    return () => {
      delete this.event[key][index];
    };
  };

  notify = (key: TKey, handle: TFunction): void => {
    Object.values(this.event[key] || {}).forEach(value => {
      if (value.hasOwnProperty('onChange') || value.hasOwnProperty('onError')) {
        // @ts-ignore
        handle(value.onChange, value.onError);
      }
    });
  };
}
