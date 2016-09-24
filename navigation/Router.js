import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import StateScreen from '../screens/StateScreen';
import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  home: () => HomeScreen,
  state: () => StateScreen,
  rootNavigation: () => RootNavigation,
}));
