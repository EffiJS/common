export type TValidator = (value: any, data: { [key: string]: any }) => boolean;

export interface IRule {
  validator: TValidator;
  message: string;
}

export interface IProperty {
  key?: {
    target: string;
    alias: string;
  };
  rules?: IRule[];
  type?: any;
}
export interface IProperties {
  [property: string]: IProperty;
}

export interface IValidatorOptions {
  skipMissingProperties: boolean;
}

export interface IValidatorErrors {
  [path: string]: Array<{
    property: string;
    message: string;
  }>;
}
