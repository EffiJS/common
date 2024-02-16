import { ServiceOptions } from '../interfaces';

export function Service(options: ServiceOptions): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('service@options', options, target);
  };
}
