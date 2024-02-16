interface String {
  format(...a: (string | number)[]): string;
  format(o: { [key: string]: string | number }): string;
}

if (!String.prototype.format) {
  // eslint-disable-next-line no-extend-native
  String.prototype.format = function (...args): string {
    if (!args.length) {
      return;
    }
    const s = this.toString();
    const t = typeof args[0];
    const n = t === 'number' || t === 'string' ? args : args[0];
    return Object.entries(n).reduce(
      (r, [key, value]) => r.replace(new RegExp(`\\{${key}\\}`, 'gi'), value),
      s,
    );
  };
}
