export class Instance {
  private static instances: { [name: string]: any } = {};

  public static get<T>(Class: new (...args: any[]) => T, level = 1): T {
    const name = (Class as { displayName?: string }).displayName || Class.name;
    if (Instance.instances[name]) {
      return Instance.instances[name];
    }

    const injectors = Reflect.getMetadata('design:paramtypes', Class) || [];
    const init = Reflect.getMetadata('constructor:init', Class);

    const tab = '  '.repeat(level);
    console.log(`${tab}INSTANCE ${name} has ${injectors?.length || 0}`, injectors);

    if (typeof init === 'function') {
      init(Class);
    }

    try {
      const injections: [] = injectors.map(<TT>(target: new () => TT) =>
        Instance.get(target, level + 1),
      );
      Instance.instances[name] = new Class(...injections);

      console.log(`${tab}- INSTANCE with name '${name}' is success created`);
    } catch (e) {
      console.log(`${tab}- ERROR: INSTANCE with name '${name}': ${e}`);
    }

    return Instance.instances[name];
  }

  public static getByDisplayName(displayName: string) {
    if (Instance.instances[displayName]) {
      return Instance.instances[displayName];
    }

    console.error(`Instance is not found for displayName '${displayName}'`);

    return null;
  }
}
