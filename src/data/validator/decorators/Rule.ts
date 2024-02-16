import { getPropertyMetadata } from './getPropertyMetadata';
import { TValidator } from '../interfaces';

const Rule =
  (validator: TValidator, defMessage: string) =>
  (message?: string): PropertyDecorator =>
  (target, propertyKey: string) => {
    const property = getPropertyMetadata(target, propertyKey);

    if (!property.rules) {
      property.rules = [];
    }

    property.rules.push({
      validator,
      message: message || defMessage,
    });
  };

export const IsDefined = Rule(
  value =>
    value !== undefined && value !== null && (typeof value === 'string' ? value !== '' : true),
  '{property} should not be null or undefined',
);

export const Regexp = (pattern: RegExp) =>
  Rule(value => pattern.test(value), '{property} is not validated by pattern');

export const Validator = (validator: TValidator, message?: string) =>
  Rule((value, data) => validator(value, data), '{property} is not validated')(message);
