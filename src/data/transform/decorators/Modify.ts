import { getMetadata } from '@common';

type THandle = (value: any, data: any) => any;

export function Modify(handle: THandle): PropertyDecorator {
  return function decorator(target, propertyKey) {
    const modify: Array<THandle> = getMetadata('modify', [], target, propertyKey);
    /* if (!Reflect.hasMetadata('modify', target, propertyKey)) {
          Reflect.defineMetadata('modify', [], target, propertyKey);
        }
        const modify = Reflect.getMetadata('modify', target, propertyKey); */
    modify.push(handle);
  };
}
