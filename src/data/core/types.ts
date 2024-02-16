export type TKey = string | number;
export type TFunction = (...args: any[]) => void;
export type TFunctionNoArgs = () => void;
export interface IDataValue {
  [key: TKey]: any;
}
export interface IErrorValue {
  [key: TKey]: any;
}
export interface IEventValue {
  [key: TKey]: any;
}

export interface IStorageRepository {
  value: {
    all(): any;
    get(key: TKey): any;
    set(key: TKey, value: any): void;
    addListItem(key: TKey, initial?: any): void;
    removeListItem(key: TKey, index: number): void;
  };
  error: {
    all(): any;
    get(key: string): any;
    set(key: string, value: any): any;
    clear(key: string): any;
  };

  event: {
    addListener(
      key: TKey,
      initial: any,
      onChangeHandle: TFunction,
      onErrorHandle?: TFunction,
    ): TFunctionNoArgs;
    notify(key: TKey, handle: TFunction): void;
  };
}
