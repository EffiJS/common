import { UrlParam } from '../interfaces';

export function Param(paramName: string): ParameterDecorator {
  return (target, propertyKey, index) => {
    const param: UrlParam = {
      paramName,
      index,
    };

    if (!Reflect.hasMetadata('url:params', target, propertyKey)) {
      Reflect.defineMetadata('url:params', [], target, propertyKey);
    }
    const urlParams: UrlParam[] = Reflect.getMetadata('url:params', target, propertyKey);
    urlParams.push(param);
  };
}
