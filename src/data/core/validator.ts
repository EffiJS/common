import { IDataValue } from './types';
import { getValidatorName, validateByClass } from '../validator';

export class Validator<T extends object> {
  static getName(validator: any) {
    return getValidatorName(validator);
  }

  constructor(protected readonly validator: new () => T) {
    getValidatorName(validator);
  }

  validate = (data: IDataValue, validator?: any) => {
    if (validator) {
      getValidatorName(validator);
      return validateByClass(data, validator);
    }

    return validateByClass(data, this.validator);
  };
}
