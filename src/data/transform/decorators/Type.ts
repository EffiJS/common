export function Type(type: any): PropertyDecorator {
  return function (target, propertyKey) {
    Reflect.defineMetadata('type', type, target, propertyKey);
  };
}
