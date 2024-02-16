import { connect as reduxConnect } from 'react-redux';
import $name, { get } from './$name.module';

export function connect(Component) {
  return reduxConnect(
    (state, props) => ({
      ...state[$name.name],
    }),
    { get },
  )(Component);
}
