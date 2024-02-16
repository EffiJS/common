import { Screen } from 'react-native-start';

import Example from './Screens/Example';

Screen.Navigator.registerScreen('$Name', Example);

export function goTo(componentId) {
  return Screen.Navigator.Screen.push(componentId, '$Name');
}
