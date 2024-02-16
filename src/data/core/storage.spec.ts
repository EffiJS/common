import 'reflect-metadata';
import { Storage } from '@data/core/storage';
import { Name, IsDefined, Validator } from '@data/validator';
// import { IStorageRepository } from './types';

describe('Form.Storage', () => {
  @Name('test')
  class Test {
    name: string;
  }

  test('Return required fields', () => {
    const storage = new Storage({}, Test);

    expect(storage).toHaveProperty('value');
    expect(storage).toHaveProperty('error');
    expect(storage).toHaveProperty('validate');
    expect(storage).toHaveProperty('event');

    storage.destroy();
    expect(Object.keys(Storage.$$storage).length).toEqual(0);
  });

  test('Response right initial values', () => {
    const storage = new Storage({ name: 'name' }, Test);

    expect(storage.value.get('name')).toEqual('name');
    storage.destroy();
    expect(Object.keys(Storage.$$storage).length).toEqual(0);
  });

  test('Set several times some value', () => {
    const storage = new Storage({}, Test);

    storage.value.set('name', 'AAA');
    storage.value.set('name', 'BBB');

    expect(storage.value.get('name')).toEqual('BBB');
    storage.destroy();
    expect(Object.keys(Storage.$$storage).length).toEqual(0);
  });

  test('Check events: add, destroy, value', () => {
    const storage = new Storage({}, Test);
    // const storage = getStorage('Storage 4');

    const listener = jest.fn();

    const eventDestroy = storage.event.addListener('name', null, listener);
    expect(typeof eventDestroy).toBe('function');

    storage.value.set('name', 'AAA');
    storage.value.set('name', 'BBB');

    eventDestroy();

    storage.value.set('name', 'CCC');

    expect(listener).toHaveBeenNthCalledWith(2, 'BBB');
    expect(storage.value.get('name')).toEqual('CCC');

    const data = storage.validate();
    expect(data).toEqual({ data: { name: 'CCC' } });

    const data2 = Storage.validate(Test);
    expect(data2).toEqual(data);

    storage.destroy();
    expect(Object.keys(Storage.$$storage).length).toEqual(0);
  });

  test('Check rules', () => {
    @Name('test1')
    class Test1 {
      @IsDefined()
      @Validator(v => v.length > 5, 'Min length equals 5')
      name: string;

      @IsDefined()
      empty: string;
    }

    const storage = new Storage({}, Test1);

    const onChange = jest.fn();
    const onChangeForEmpty = jest.fn();
    const onError = jest.fn();
    const onErrorForEmpty = jest.fn();

    // storage.rule.set('name', [{ required: true }]);
    // storage.rule.set('empty', [{ required: true }]);

    const eventForNameDestroy = storage.event.addListener('name', null, onChange, onError);
    const eventForEmptyDestroy = storage.event.addListener(
      'empty',
      null,
      onChangeForEmpty,
      onErrorForEmpty,
    );
    expect(typeof eventForNameDestroy).toBe('function');
    expect(typeof eventForEmptyDestroy).toBe('function');

    storage.value.set('name', 'AAA');
    storage.value.set('name', 'BBB');

    expect(onChange).toHaveBeenNthCalledWith(2, 'BBB');
    expect(onError).toHaveBeenNthCalledWith(2, undefined);

    expect(onChangeForEmpty).toHaveBeenCalledTimes(0);
    expect(onErrorForEmpty).toHaveBeenCalledTimes(0);

    const res = storage.validate();

    const name = [
      {
        message: 'Min length equals 5',
        property: 'name',
      },
    ];

    const empty = [
      {
        message: '{property} should not be null or undefined',
        property: 'empty',
      },
    ];

    expect(res.error).toEqual({ name, empty });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenNthCalledWith(3, name);

    expect(onChangeForEmpty).toHaveBeenCalledTimes(0);
    expect(onErrorForEmpty).toHaveBeenNthCalledWith(1, empty);

    expect(res.data).toEqual(undefined);

    eventForNameDestroy();
    eventForEmptyDestroy();

    storage.destroy();
    expect(Object.keys(Storage.$$storage).length).toEqual(0);
  });
});
