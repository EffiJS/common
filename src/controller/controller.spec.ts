import 'reflect-metadata';
import '@utils/string';

import { Controller } from './decorators';
import { Instance } from '../common/Instance';

describe('Module.Controller', () => {
  test('init', () => {
    @Controller()
    class OrderController {
      static displayName = 'OrderController.Changed'
    }

    expect(OrderController.name).toEqual('OrderController');
    expect(OrderController.displayName).toEqual('OrderController.Changed');

    const orderController = Instance.get(OrderController);
    const orderControllerByDisplayName = Instance.getByDisplayName(OrderController.displayName);

    expect(orderController === orderControllerByDisplayName).toEqual(true);
    // expect(orderController.constructor.name).toEqual('OrderController');
    // expect(orderController.constructor.displayName).toEqual('OrderController.Changed');
  });
});
