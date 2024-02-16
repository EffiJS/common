import { getPropertyMetadata } from './getPropertyMetadata';

export const Type =
  (type: any | ((value: any) => any)): PropertyDecorator =>
  (target, propertyKey: string) => {
    const property = getPropertyMetadata(target, propertyKey);
    property.type = type;
  };
