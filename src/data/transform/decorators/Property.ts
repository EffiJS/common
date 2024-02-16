import { getMetadata } from "@common";

export function Property(source?: string): PropertyDecorator {
  return function(target, propertyKey) {
    // const property = getMetadata('property', {}, target);
    if (!Reflect.hasMetadata("property", target)) {
      Reflect.defineMetadata("property", {}, target);
    }
    const property = Reflect.getMetadata("property", target);
    property[propertyKey] = source || undefined;
  };
}
