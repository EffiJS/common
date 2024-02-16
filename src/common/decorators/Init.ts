export const Init = (handle: Function): ClassDecorator => (target: any) => {
  Reflect.defineMetadata('constructor:init', handle, target);
};
