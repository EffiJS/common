import { getPropertyMetadata } from './getPropertyMetadata';
import { IProperty } from '../interfaces';

export const Property =
  (alias?: string): PropertyDecorator =>
  (target, propertyKey: string) => {
    const property: IProperty = getPropertyMetadata(target, propertyKey);
    property.key = {
      target: propertyKey,
      alias,
    };
  };
