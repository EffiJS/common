import { Store } from './Store';

describe('Module.Store.', () => {
  test('init', () => {
    const state = new Store({
      params: {
        page: {
          number: 0,
          size: 10,
        },
        cursor: {
          cursor: 'id',
          size: 10,
        },
        filter: {
          statuses: ['pending', 'rejected'],
          search: 'query',
          categories: [1, 3, 5],
        },
        sort: [{ id: 'desc' }, { name: 'asc' }],
      },
      list: {
        id1: {
          id: 1,
          name: 'name 1',
          title: 'title 1',
          category_id: 1,
        },
        id2: {
          id: 2,
          name: 'name 2',
          title: 'title 2',
          category_id: 2,
        },
        order: ['id1', 'id2'],
      },
    });

    expect(state.get('params')).toEqual({
      page: {
        number: 0,
        size: 10,
      },
      cursor: {
        cursor: 'id',
        size: 10,
      },
      filter: {
        statuses: ['pending', 'rejected'],
        search: 'query',
        categories: [1, 3, 5],
      },
      sort: [{ id: 'desc' }, { name: 'asc' }],
    });

    expect(state.get('params.page')).toEqual({
      number: 0,
      size: 10,
    });
  });

  test('Test events', () => {
    const state = new Store({
      params: {
        page: {
          number: 0,
          size: 10,
        },
        cursor: {
          cursor: 'id',
          size: 10,
        },
        filter: {
          statuses: ['pending', 'rejected'],
          search: 'query',
          categories: [1, 3, 5],
        },
        sort: [{ id: 'desc' }, { name: 'asc' }],
      },
    });

    const onNotify = jest.fn();
    const onNotify1 = jest.fn();
    const destroy = state.subscribe(['params'], onNotify);
    const destroy1 = state.subscribe(['params.page'], onNotify1);

    expect(onNotify).toHaveBeenCalledTimes(1); // first call was on subscribe
    expect(onNotify1).toHaveBeenCalledTimes(1);

    state.set('params.page.number', 5);
    state.set('params.page.size', 15);
    state.set('params.cursor.size', 15);
    state.set('params.test.size', 15);

    expect(onNotify).toHaveBeenCalledTimes(5);
    expect(onNotify1).toHaveBeenCalledTimes(3);

    expect(state.get('params.page')).toEqual({
      number: 5,
      size: 15,
    });

    expect(state.get('params.test')).toEqual({
      size: 15,
    });

    expect(state.get('params.test1.a.b')).toEqual(undefined);

    expect(state.get('params.sort[0]')).toEqual({ id: 'desc' });
    expect(state.get('params.sort.0')).toEqual({ id: 'desc' });
    const a = state.get('params.sort[0].id');
    const b = state.get('params.sort.0.id');
    expect(a === 'desc' && b === 'desc' && a === b).toBeTruthy();

    state.set('params.sort[1].id', 'new id');

    expect(state.get('params.sort.1')).toEqual({
      id: 'new id',
      name: 'asc',
    });

    destroy();
    destroy1();
  });

  test('Dispatch event with right parameters', () => {
    const state = new Store({
      params: {
        page: {
          number: 0,
          size: 10,
        },
        cursor: {
          cursor: 'id',
          size: 10,
        },
        filter: {
          statuses: ['pending', 'rejected'],
          search: 'query',
          categories: [1, 3, 5],
        },
        sort: [{ id: 'desc' }, { name: 'asc' }],
      },
    });

    const onNotify = jest.fn();
    const onNotify1 = jest.fn();
    const destroy = state.subscribe(['params.filter', 'params.cursor'], onNotify);
    const destroy1 = state.subscribe(['params.page'], onNotify1);

    expect(onNotify).toHaveBeenNthCalledWith(1, {
      filter: {
        statuses: ['pending', 'rejected'],
        search: 'query',
        categories: [1, 3, 5],
      },
      cursor: {
        cursor: 'id',
        size: 10,
      },
    });
    expect(onNotify1).toHaveBeenNthCalledWith(1, {
      page: {
        number: 0,
        size: 10,
      },
    });

    state.set('params.page.number', 5);
    state.set('params.page.size', 15);
    state.set('params.cursor.size', 15);
    state.set('params.test.size', 15);

    expect(onNotify).toHaveBeenNthCalledWith(2, {
      filter: {
        statuses: ['pending', 'rejected'],
        search: 'query',
        categories: [1, 3, 5],
      },
      cursor: {
        cursor: 'id',
        size: 15,
      },
    });
    expect(onNotify1).toHaveBeenNthCalledWith(3, {
      page: {
        number: 5,
        size: 15,
      },
    });

    expect(state.get('params.filter')).toEqual({
      statuses: ['pending', 'rejected'],
      search: 'query',
      categories: [1, 3, 5],
    });

    expect(state.get('params.page')).toEqual({
      number: 5,
      size: 15,
    });

    expect(state.get('params.test')).toEqual({
      size: 15,
    });

    expect(state.get('params.test1.a.b')).toEqual(undefined);

    /* expect(state.get('params.sort[0]')).toEqual({ id: 'desc' });
    expect(state.get('params.sort.0')).toEqual({ id: 'desc' });
    const a = state.get('params.sort[0].id');
    const b = state.get('params.sort.0.id');
    expect(a === 'desc' && b === 'desc' && a === b).toBeTruthy();

    state.set('params.sort[1].id', 'new id');

    expect(state.get('params.sort.1')).toEqual({
      id: 'new id',
      name: 'asc',
    }); */

    destroy();
    destroy1();
  });

  test('Test notifications ', () => {
    const state = new Store({
      params: {
        page: {
          number: 0,
          size: 10,
        },
        cursor: {
          cursor: 'id',
          size: 10,
        },
        filter: {
          statuses: ['pending', 'rejected'],
          search: 'query',
          categories: [1, 3, 5],
        },
        sort: [{ id: 'desc' }, { name: 'asc' }],
      },
      list: {
        id1: {
          id: 1,
          name: 'name 1',
          title: 'title 1',
          category_id: 1,
          category: {
            id: 20,
            name: 'Category 20',
          },
        },
        id2: {
          id: 2,
          name: 'name 2',
          title: 'title 2',
          category_id: 2,
        },
        order: ['id1', 'id2'],
      },
    });

    const onNotify = jest.fn();
    const onNotify1 = jest.fn();
    const onNotify2 = jest.fn();
    const onNotify3 = jest.fn();
    const destroy = state.subscribe(['params.filter', 'params.cursor'], onNotify);
    const destroy1 = state.subscribe(['list.id1'], onNotify1);
    const destroy2 = state.subscribe(['list.id1.name'], onNotify2);
    const destroy3 = state.subscribe(['list.order'], onNotify3);

    expect(onNotify).toHaveBeenNthCalledWith(1, {
      filter: {
        statuses: ['pending', 'rejected'],
        search: 'query',
        categories: [1, 3, 5],
      },
      cursor: {
        cursor: 'id',
        size: 10,
      },
    });
    expect(onNotify1).toHaveBeenNthCalledWith(1, {
      id1: {
        id: 1,
        name: 'name 1',
        title: 'title 1',
        category_id: 1,
        category: {
          id: 20,
          name: 'Category 20',
        },
      },
    });
    expect(onNotify2).toHaveBeenNthCalledWith(1, {
      name: 'name 1',
    });

    state.set('list.id1.name', 'name updated 1');

    expect(onNotify1).toHaveBeenNthCalledWith(2, {
      id1: {
        id: 1,
        name: 'name updated 1',
        title: 'title 1',
        category_id: 1,
        category: {
          id: 20,
          name: 'Category 20',
        },
      },
    });

    expect(onNotify2).toHaveBeenNthCalledWith(2, {
      name: 'name updated 1',
    });

    expect(onNotify).toHaveBeenCalledTimes(1);

    state.set('list.id1.category.name', 'Updated category');

    expect(onNotify1).toHaveBeenCalledTimes(3);
    expect(onNotify2).toHaveBeenCalledTimes(2);
    expect(onNotify3).toHaveBeenCalledTimes(1);

    state.set('list.id1', { name: 'name re-updated 1' });

    expect(onNotify1).toHaveBeenNthCalledWith(4, {
      id1: {
        name: 'name re-updated 1',
      },
    });
    expect(onNotify2).toHaveBeenNthCalledWith(3, {
      name: 'name re-updated 1',
    });

    expect(onNotify).toHaveBeenCalledTimes(1);
    expect(onNotify3).toHaveBeenCalledTimes(1);

    /* state.set('params.page.number', 5);
    state.set('params.page.size', 15);
    state.set('params.cursor.size', 15);
    state.set('params.test.size', 15);

    expect(onNotify).toHaveBeenNthCalledWith(2, {
      filter: {
        statuses: ['pending', 'rejected'],
        search: 'query',
        categories: [1, 3, 5],
      },
      cursor: {
        cursor: 'id',
        size: 15,
      },
    });
    expect(onNotify1).toHaveBeenNthCalledWith(3, {
      page: {
        number: 5,
        size: 15,
      },
    });

    expect(state.get('params.filter')).toEqual({
      statuses: ['pending', 'rejected'],
      search: 'query',
      categories: [1, 3, 5],
    });

    expect(state.get('params.page')).toEqual({
      number: 5,
      size: 15,
    });

    expect(state.get('params.test')).toEqual({
      size: 15,
    });

    expect(state.get('params.test1.a.b')).toEqual(undefined); */

    destroy();
    destroy1();
    destroy2();
    destroy3();

    // console.log(state.listeners);
  });

  test('Get multiple keys', () => {
    const state = new Store({
      params: {
        page: {
          number: 0,
          size: 10,
        },
        cursor: {
          cursor: 'id',
          size: 10,
        },
        filter: {
          statuses: ['pending', 'rejected'],
          search: 'query',
          categories: [1, 3, 5],
        },
        sort: [{ id: 'desc' }, { name: 'asc' }],
      },
    });

    const d1 = state.get([{ filter: 'params.filter', cursor: 'params.cursor' }]);
    const d2 = state.get([{ page: 'params.page' }]);

    expect(d1).toEqual({
      filter: {
        statuses: ['pending', 'rejected'],
        search: 'query',
        categories: [1, 3, 5],
      },
      cursor: {
        cursor: 'id',
        size: 10,
      },
    });
    expect(d2).toEqual({
      page: {
        number: 0,
        size: 10,
      },
    });
  });
});
