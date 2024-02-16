import { EValidatorMetadata } from '../enums';

export const Name =
  (name: string): ClassDecorator =>
  target => {
    Reflect.defineMetadata(EValidatorMetadata.name, name, target);
  };
