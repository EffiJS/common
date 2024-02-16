import { Service } from 'react-native-start';

class $Name extends Service.CRUD {
  get = () => {
    return super.get(null, ['endpoint', 'url']);
  };
}

const $name = new $Name('$Name', '/api/v1/$name', true);

export const {
  get,
} = $name;

export default $name;
