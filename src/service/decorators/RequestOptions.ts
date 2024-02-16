import { RequestDecoratorMetadata } from '../interfaces';

const createRequestOption =
  (...path: string[]): ((key?: string) => ParameterDecorator) =>
  (key?: string): ParameterDecorator =>
  (target, propertyKey, parameterIndex) => {
    if (!Reflect.hasMetadata('options', target, propertyKey)) {
      Reflect.defineMetadata('options', {}, target, propertyKey);
    }
    const options: RequestDecoratorMetadata = Reflect.getMetadata('options', target, propertyKey);

    options[parameterIndex] = {
      parameterIndex,
      path,
      key,
      // Need to add prepare function here, for example:
      // - for { headers: { Authorization: 'Bearer CODE' } }
      // - for FormData processing
    };
  };

export const Params = createRequestOption('params');

export const Filter = createRequestOption('params', 'filter');

export const Page = createRequestOption('params', 'page');

export const Cursor = createRequestOption('params', 'cursor');

export const Sort = createRequestOption('params', 'sort');

export const Data = createRequestOption('data')();

export const FormData: ParameterDecorator = (target, propertyKey, parameterIndex) => {
  if (!Reflect.hasMetadata('options.data:form-data', target, propertyKey)) {
    Reflect.defineMetadata('options.data:form-data', {}, target, propertyKey);
  }

  const formData = Reflect.getMetadata('options.data:form-data', target, propertyKey);
  formData[parameterIndex] = true;
};

export const Authorization = createRequestOption('headers', 'Authorization')();

export const OnUploadProgress = createRequestOption('onUploadProgress')();

export const OnDownloadProgress = createRequestOption('onDownloadProgress')();

export const Signal = createRequestOption('signal')();
