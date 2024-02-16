import { normalize } from './normalize';

describe('Module.Store.Core.normalize', () => {
  test('Normalize function', () => {
    /* const res = normalize(['key', 'key1', 'key2']);
    expect(res).toEqual({
      key: 'key',
      key1: 'key1',
      key2: 'key2',
    }); */

    const res = {};
    normalize(['key', { aliasForKey1: 'key1' }, { a2: 'k2', a3: 'k3' }], res);
    expect(res).toEqual({
      key: 'key',
      key1: 'aliasForKey1',
      k2: 'a2',
      k3: 'a3',
    });
  });
});
