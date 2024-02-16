import 'reflect-metadata';
import '@utils/string';

import { Service, Get, Param, Params, Filter, Page } from './index';

/*

@Service({
  endpoint: 'orders',
})
class OrderService {
  constructor(protected service: ServerApi) {
  }

  @Get('/:id')
  @Post('/:id')
  @Put('/:id')
  @Save('/:id') // check if data has id
  @Delete('/:id')
  getList(
      @Param('id') id: number | string,
      @Params params: {},
      @Filter('statuses') statuses: string[],
      @Page('number' | 'size' | undefined) { number, size }: PageType,
      @Sort([]) [{field: 'asc' | 'desc'}]: SortType,
      @Cursor() { cursor }: CursorType,
      @Data data: any,
      @Data @FormData data: any, // Fixed))) Decorator Composition
      @OnUploadProgress onUpload: Function,
      @OnDownloadProgress onDownload: Function,

      // const controller = new AbortController();
      // axios.get('/foo/bar', {
      //    signal: controller.signal
      // }).then(function(response) {
      // });
      // cancel the request
      // controller.abort()

      @Signal signal: any
  ) {
    return options => this.service.request(options)
  }
}
*/

describe('Module.Service', () => {
  test('init', () => {
    const fnGetAll = jest.fn();
    const fnGetById = jest.fn();
    const fnGetForUser = jest.fn();

    @Service({
      endpoint: '/orders',
    })
    class OrderService {
      @Get()
      getAll(@Params() params: object) {
        return fnGetAll;
        /* return (options) => {
        }; */
      }

      @Get('{id}')
      getById(@Param('id') id: string | number) {
        return fnGetById;
      }

      @Get('{id}/user/{user_id}')
      getForUser(
        @Param('id') user_id: string | number,
        @Param('user_id') id: string | number,
        @Filter('status') status: string,
        @Page('number') number: number,
        // @Page('number') page: {number: number, size: number},
      ) {
        return fnGetForUser;
      }
    }

    const orderService = new OrderService();

    orderService.getAll({ filter: { status: 'active' } });
    expect(fnGetAll).toHaveBeenNthCalledWith(1, {
      method: 'get',
      url: '/orders',
      params: {
        filter: { status: 'active' },
      },
    });

    orderService.getById(44);
    expect(fnGetById).toHaveBeenNthCalledWith(1, {
      method: 'get',
      url: '/orders/44',
    });

    orderService.getForUser(111, 555, 'ACTIVE', 44);
    expect(fnGetForUser).toHaveBeenNthCalledWith(1, {
      method: 'get',
      url: '/orders/111/user/555',
      params: {
        filter: {
          status: 'ACTIVE',
        },
        page: {
          number: 44,
        },
      },
    });
  });
});
