import { EffiError } from '@error';
import { EValidatorMetadata } from './enums';
import { IProperties, IValidatorErrors, IValidatorOptions } from './interfaces';

export function getValidatorName<T>(validator: new () => T): string {
  const name = Reflect.getMetadata(EValidatorMetadata.name, validator);

  if (!name) {
    throw new EffiError(
      'Name is not defined for validator. Add @Name() decorator to assign validator name',
    );
  }

  return name;
}

export function validateByClass<T extends object>(
  data: any,
  ClassType: new () => T,
): {
  validated: T;
  error: IValidatorErrors;
} {
  const error: IValidatorErrors = {};

  const setError = (path: string, property: string, message: string) => {
    if (!error[path]) {
      error[path] = [];
    }
    error[path].push({ property, message });
  };

  const validated = validate(data, ClassType, { skipMissingProperties: false }, setError);

  return {
    validated,
    error,
  };
}

function validate<T extends object>(
  data: any,
  ClassType: new () => T,
  optionsDefault: IValidatorOptions,
  setError: (path: string, property: string, message: string) => void,
  errorPath?,
): T {
  if (!ClassType) {
    // For untyped nested objects or arrays
    // TODO: Think if need throw Error
    return optionsDefault.skipMissingProperties ? undefined : data;
  }

  const instance = new ClassType();

  const optionsInstance: IValidatorOptions =
    Reflect.getMetadata(EValidatorMetadata.options, instance.constructor) || {};
  const options = { ...optionsDefault, ...optionsInstance };
  const properties: IProperties =
    Reflect.getMetadata(EValidatorMetadata.properties, instance.constructor) || {};

  const availableKeys = [];

  Object.entries(data).forEach(([key, value]: [string, any]) => {
    const type = Reflect.getMetadata('design:type', instance, key);

    if (!type) {
      if (!options.skipMissingProperties) {
        instance[key] = value;
      }
      return;
    }

    availableKeys.push(key);

    const currentErrorPath = formatPath(errorPath, key);

    Array.isArray(properties[key].rules) &&
      properties[key].rules.forEach(({ validator, message }) => {
        const success = validator(value, data);
        if (!success) {
          setError(currentErrorPath, key, message);
        }
      });

    if (type === Array) {
      if (!Array.isArray(value)) {
        setError(currentErrorPath, key, '{property} is not an array');
        return;
      }
      instance[key] = value.map((item: any, index: number) => {
        const dataType =
          typeof properties[key].type === 'function'
            ? properties[key].type(item)
            : properties[key].type;

        if ([String, Number, Boolean].includes(dataType)) {
          return item;
        }

        return validate(
          item,
          dataType,
          options,
          setError,
          formatPath(currentErrorPath, String(index)),
        );
      });
    } else if (type === String) {
      instance[key] = value === null || value === undefined ? value : String(value);
    } else if (type === Number) {
      instance[key] = value === null || value === undefined ? value : Number(value);
    } else if (type === Boolean) {
      instance[key] = value === null || value === undefined ? value : Boolean(value);
    } else if (type === Date || value instanceof Date) {
      if (value instanceof Date) {
        instance[key] = new Date(value.valueOf());
      } else {
        instance[key] = value === null || value === undefined ? value : new Date(value);
      }
    } else {
      instance[key] =
        value && properties[key].type
          ? validate(
              value,
              typeof properties[key].type === 'function'
                ? properties[key].type(value)
                : properties[key].type,
              options,
              setError,
              currentErrorPath,
            )
          : value;
    }
  });

  Object.entries(properties).forEach(([key, property]) => {
    if (availableKeys.includes(key)) {
      return;
    }

    const currentErrorPath = formatPath(errorPath, key);
    property.rules?.forEach(({ validator, message }) => {
      const success = validator(data[key], data);
      if (!success) {
        setError(currentErrorPath, key, message);
      }
    });
  });

  return instance;
}

function formatPath(path: string | undefined, key: string): string {
  return [path, key].filter(k => k ?? 0).join('.');
}
