import 'reflect-metadata';

import { validateByClass, Options, Property, Type, Validator, Regexp, IsDefined } from './index';

describe('Validator', () => {
  test('type checker function', () => {
    function getType(v: any) {
      if (typeof v === 'function') {
        if (!v.name) {
          return 'function';
        }

        const firstLetterOfName = v.name[0];

        return firstLetterOfName.toUpperCase() === firstLetterOfName ? 'class' : 'function';
      }

      if (typeof v === 'string') {
        return 'string';
      }

      if (typeof v === 'number') {
        return 'number';
      }
    }

    function typeIs(
      value: any,
    ): 'class' | 'function' | 'string' | 'boolean' | 'number' | 'array' | 'date' {
      if (typeof value === 'function') {
        if (!value.name) {
          // unnamed function () => {} or function() {}
          return 'function';
        }
        const firstLetterOfName = value.name[0];
        return firstLetterOfName.toUpperCase() === firstLetterOfName ? 'class' : 'function';
      } else if (typeof value === 'string') {
        return 'string';
      } else if (typeof value === 'boolean') {
        return 'boolean';
      } else if (typeof value === 'number') {
        return 'number';
      } else if (Array.isArray(value)) {
        return 'array';
      } else if (value instanceof Date) {
        return 'date';
      } else {
        throw new Error('Unsupported type');
      }
    }

    class A {
      test: 'a';
    }
    function b() {}
    const dateValue = new Date();

    expect(typeIs(b)).toEqual('function');
    expect(typeIs(() => {})).toEqual('function');
    expect(typeIs(function () {})).toEqual('function');
    expect(typeIs(A)).toEqual('class');
    expect(typeIs('Test')).toEqual('string');
    expect(typeIs(123)).toEqual('number');
    expect(typeIs(false)).toEqual('boolean');
    expect(typeIs([1, 2])).toEqual('array');
    expect(typeIs(new Date())).toEqual('date');
    // expect(typeIs(Date)).toEqual('class');
  });

  test('init', () => {
    class Category {
      @Property()
      @Validator(v => v.length <= 5, 'Maximum length')
      name: string;

      @Property()
      @IsDefined()
      color: string;
    }

    @Options({
      skipMissingProperties: true,
    })
    class User {
      // @String()
      @Property()
      @IsDefined('First Name is required') // instead of field is required
      firstName: string;

      // @String()
      @Property()
      @Validator(v => v.length > 10, 'Minimal length')
      lastName: string;

      @Property()
      @Type(Category)
      categories: Category[];
    }

    const data = {
      // firstName: 'John',
      lastName: 'Doe',
      categories: [{ name: 'local' }, { name: 'general' }],
      gender: 'male',
    };

    const res = validateByClass<User>(data, User);

    expect(res.validated).toBeInstanceOf(User);
    expect(res.validated.categories?.[0]).toBeInstanceOf(Category);

    // console.log(res.validated)

    expect(res.validated).toEqual({
      // firstName: 'John',
      lastName: 'Doe',
      categories: [{ name: 'local' }, { name: 'general' }],
      // gender: 'male',
    });
    // expect(user.test()).toEqual(3);
    // expect(user.name).toEqual('John Doe');
    // expect(user.firstName).toEqual(data.first_name);
  });
});
