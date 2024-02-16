import { IValidatorOptions } from '../interfaces';
import { EValidatorMetadata } from '../enums';

export const Options =
  (options: IValidatorOptions): ClassDecorator =>
  target => {
    Reflect.defineMetadata(EValidatorMetadata.options, options, target);
  };
