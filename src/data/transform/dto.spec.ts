import 'reflect-metadata';

import { plainToClass, Property, Type } from './index';

describe('DTO', () => {
  test('test', () => {
    const t = () => Boolean;

    expect(t).toBeInstanceOf(Function);
    expect(t instanceof Function).toBeTruthy();
    expect(Boolean instanceof Function).toBeTruthy();
  });
  test('init', () => {
    class Category {
      @Property()
      name: string;
    }

    class User {
      // @String()
      @Property('first_name')
      firstName: string;

      // @String()
      @Property('last_name')
      lastName: string;

      @Property()
      @Type(Category)
      categories: Category[];

      test(): number {
        return 3;
      }

      get name(): string {
        return `${this.firstName} ${this.lastName}`;
      }
    }

    const data = {
      first_name: 'John',
      last_name: 'Doe',
      categories: [{ name: 'local' }, { name: 'general' }],
      gender: 'male',
    };

    const user = plainToClass<User>(data, User);

    console.log(user);

    expect(user).toBeInstanceOf(User);
    expect(user.categories?.[0]).toBeInstanceOf(Category);
    expect(user).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      categories: [{ name: 'local' }, { name: 'general' }],
    });
    expect(user.test()).toEqual(3);
    expect(user.name).toEqual('John Doe');
    expect(user.firstName).toEqual(data.first_name);
  });

  test('test arrays', () => {
    class Category {
      @Property()
      name: string;
    }

    class User {
      @Property()
      @Type(String)
      ids: string[];
    }

    const data = {
      ids: ['John', 'Doe'],
    };

    const user = plainToClass<User>(data, User);

    console.log(user);

    expect(user).toBeInstanceOf(User);
  });
});
