import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';

import $name, {} from '@services/$Name/$name.module';
import {} from '@services/$Name/$name.service';

function Example() {
  return (
    <View />
  );
}

export default connect(state => ({
  data: [$name.name],
}), {})(Example);
