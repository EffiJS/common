import { useCallback } from 'react';
import { Screen } from 'react-native-start';
import { goTo } from './$name.navigation';

export function use$NameNavigation() {
  const { componentId } = Screen.useScreenContext();
  const go = useCallback(
    function () {
      return goTo(componentId);
    },
    [componentId],
  );

  return {
    goTo: go,
  };
}
