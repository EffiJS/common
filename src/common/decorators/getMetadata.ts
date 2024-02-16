export function getMetadataTarget(target: Object) {
  return typeof target === 'object' ? target.constructor : target;
  // return typeof key === 'string' ? target.constructor : target;
}

export function getMetadata<T>(metadataKey: string, initial: T, target: Object, key?: string | symbol): T {
  // const trg = getMetadataTarget(target);

  if (!Reflect.hasMetadata(metadataKey, target, key)) {
    Reflect.defineMetadata(metadataKey, initial, target, key);
  }
  return Reflect.getMetadata(metadataKey, target, key);
}

export type NavigationMetadataType = { [key: string]: any }
