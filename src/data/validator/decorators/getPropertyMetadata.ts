import { getMetadata } from '@common';
import { IProperties, IProperty } from '../interfaces';
import { EValidatorMetadata } from '../enums';

export function getPropertyMetadata(target: any, propertyKey: string): IProperty {
  const rules: IProperties = getMetadata(EValidatorMetadata.properties, {}, target.constructor);
  if (!rules[propertyKey]) {
    rules[propertyKey] = {};
  }

  return rules[propertyKey];
}
