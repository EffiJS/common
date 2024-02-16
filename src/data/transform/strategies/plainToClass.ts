import { splitPath } from '@data/core';

type TPlainData = {
  [key: string]: any;
};

export function plainToClass<T extends object>(plainObject: TPlainData, ClassType: new () => T): T {
  const instance = new ClassType();
  const property: { [key: string]: string | undefined } = Reflect.getMetadata('property', instance);

  if (!plainObject) {
    return instance;
  }

  Object.entries(property).forEach(([targetKey, sourceKey]) => {
    const type = Reflect.getMetadata('design:type', instance, targetKey);
    // console.log('@', targetKey, type, typeof type, type.constructor);
    // const plaintKey = sourceKey || targetKey;

    let value = getValue(plainObject, sourceKey || targetKey);

    if (Reflect.hasMetadata('modify', instance, targetKey)) {
      const modify = Reflect.getMetadata('modify', instance, targetKey);
      value = modify.reduce((r, handle) => handle(r, plainObject), value);
    }

    // TODO: Allow to use source keys as key.a.b
    // if (value) {
    // if (plainObject && plainObject.hasOwnProperty(plaintKey)) {
    // // const type = Reflect.getMetadata('design:type', obj, key);
    // // console.log('@', key, type);
    // const value = plainObject[plaintKey];
    const dataType = Reflect.getMetadata('type', instance, targetKey);
    if (type === Array) {
      instance[targetKey] = value.map((item: any) => {
        if ([String, Number, Boolean].includes(dataType)) {
          return item;
        }
        return plainToClass(item, dataType);
      });
    } else if (type === String) {
      instance[targetKey] = value === null || value === undefined ? value : String(value);
    } else if (type === Number) {
      instance[targetKey] = value === null || value === undefined ? value : Number(value);
    } else if (type === Boolean) {
      instance[targetKey] = value === null || value === undefined ? value : Boolean(value);
    } else if (type === Date || value instanceof Date) {
      if (value instanceof Date) {
        instance[targetKey] = new Date(value.valueOf());
      } else {
        instance[targetKey] = value === null || value === undefined ? value : new Date(value);
      }
      // } else if () {
    } else {
      instance[targetKey] = value && dataType ? plainToClass(value, dataType) : value;
    }
    // }
  });

  return instance;
}

function getValue(plainData: TPlainData, key: string) {
  if (!plainData) {
    return undefined;
  }

  if (plainData.hasOwnProperty(key)) {
    return plainData[key];
  }

  const keyPath = splitPath(key);
  return keyPath.reduce((r, k) => r?.[k], plainData);
}
