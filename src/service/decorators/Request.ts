import { EffiError } from '@error';
import { appendFilesToFormData } from '../utils/appendFilesToFormData';
import {
  RequestDecoratorMetadata,
  RequestDecoratorMetadataData,
  RequestMethod,
  RequestMethodVariant,
  RequestOptions,
  ServiceOptions,
  UrlParam,
} from '../interfaces';

const createRequestDecorator =
  (method: RequestMethodVariant): ((url?: string) => MethodDecorator) =>
  (url?: string): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const origin = descriptor.value;

    descriptor.value = function (...args) {
      const targetName = target.constructor.name;
      const general: ServiceOptions =
        Reflect.getMetadata('service@options', target.constructor) || {};
      const options: RequestDecoratorMetadata =
        Reflect.getMetadata('options', target, propertyKey) || {};
      const path = [general.endpoint];
      const requestOptions: RequestOptions = {
        method,
      };

      const urlParams: UrlParam[] = Reflect.getMetadata('url:params', target, propertyKey) || [];
      const uLength = urlParams.length;

      if (url) {
        const requiredUrlParams = url.split('{').length - 1;

        if (uLength !== requiredUrlParams) {
          throw new EffiError(
            `${targetName}.${propertyKey}: Url params is not equal for url '${url}'. Required - ${requiredUrlParams}, defined - ${uLength}`,
          );
        }

        if (uLength) {
          const preparedUrlParams = urlParams.reduce((r, param) => {
            r[param.paramName] = args[param.index];
            return r;
          }, {});

          path.push(url.format(preparedUrlParams));
        } else {
          path.push(url);
        }
      } else if (uLength) {
        throw new EffiError(
          `${targetName}.${propertyKey}: Defined url params (length ${uLength}) but url is not defined`,
        );
      }

      const oLength = Object.keys(options).length;
      const aLength = args.length;
      const pLength = uLength + oLength;

      if (pLength !== aLength) {
        throw new EffiError(
          `${targetName}.${propertyKey}: Method requires ${pLength} but got ${aLength} for url '${url}'`,
        );
      }

      if (oLength) {
        Object.values(options).forEach((opt: RequestDecoratorMetadataData) => {
          const path = [...opt.path];
          opt.key && path.push(opt.key);
          const k = path.pop();
          const o = path.reduce((r, k) => {
            if (!r.hasOwnProperty(k)) {
              r[k] = {};
            }
            return r[k];
          }, requestOptions);

          o[k] = args[opt.parameterIndex];
        });
      }

      if (method === 'save') {
        if (requestOptions?.data?.id) {
          path.push(requestOptions.data.id);
          requestOptions.method = RequestMethod.PUT;
          delete requestOptions.data.id;
        } else {
          requestOptions.method = RequestMethod.POST;
        }
      }

      if (['post', 'put', 'save'].includes(method)) {
        const formData = Reflect.getMetadata('options.data:form-data', target, propertyKey);
        if (formData) {
          // TODO: Review 'prepareFormData' function
          requestOptions.data = prepareFormData(requestOptions.data);

          if (!requestOptions.headers) {
            requestOptions.headers = {};
          }
          requestOptions.headers['Content-Type'] = 'multipart/form-data';
        }
      }

      requestOptions.url = path.join('/'); // .replaceAll(/\/{2,}/g, '/')

      // TODO: Check if possible to run here
      // return this.api.request(requestOptions)

      const handler = origin.apply(this, args); // Issue when async used if function
      if (handler instanceof Promise) {
        return new Promise(resolve => handler.then(r => resolve(r(requestOptions))));
      }

      return handler(requestOptions);
    };
  };

// TODO: Review this function
function prepareFormData(data) {
  const formData = new FormData();
  const updated = appendFilesToFormData(data, formData);
  const json = JSON.stringify(updated);
  formData.append('json', json);
  return formData;
}

export const Get = createRequestDecorator(RequestMethod.GET);

export const Post = createRequestDecorator(RequestMethod.POST);

export const Put = createRequestDecorator(RequestMethod.PUT);

export const Save = createRequestDecorator(RequestMethod.SAVE);

export const Delete = createRequestDecorator(RequestMethod.DELETE);
