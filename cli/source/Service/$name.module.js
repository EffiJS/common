import { Module } from 'react-native-start';
import { mergeDeepRight } from 'ramda';
import $NameService from './$name.service';

const { module: { registerAction }, utils } = Module;

const ACTION = {
  GET: 'GET',
};

class $Name extends Module.WithService {
  get = this.get.bind(this);

  @registerAction(ACTION.GET)
  async get() {
    const res = await this.serviceProvider.get();
    return res;
  }

  onFulfilled(state, type, payload) {
    switch (type) {
      case ACTION.GET: {
        return mergeDeepRight(state, payload);
      }

      default:
        return super.onFulfilled(state, type, payload);
    }
  }
}

const $name = new $Name('$Name', $NameService);

export const {
  get,
} = $name;

export default $name.storeSettings;
