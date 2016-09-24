import React, {
  PropTypes
} from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  View,
  WebView,
} from 'react-native';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';

import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import Router from '../navigation/Router';

import {
  StateIcons,
} from '../Data';

let st = 'OH';

export default class RootNavigation extends React.Component {
  render() {
    return (
      <TabNavigation
        tabBarHeight={56}
        initialTab="home">
        <TabNavigationItem
          id="home"
          renderIcon={isSelected => this._renderIcon('home', isSelected)}>
          <StackNavigation initialRoute={Router.getRoute('home')} />
        </TabNavigationItem>
        {this._renderStateTabItem('OH')}
        {this._renderStateTabItem('PA')}
        {this._renderStateTabItem('FL')}
      </TabNavigation>
    );
  }

  _renderStateTabItem(state) {
    return (
      <TabNavigationItem
        id={state}
        renderIcon={isSelected => this._renderStateIcon(state, isSelected)}>
        <StackNavigation initialRoute={Router.getRoute('state', { state })} />
      </TabNavigationItem>
    );
  }

  _renderIcon(name, isSelected) {
    return (
      <FontAwesome
        name={name}
        size={32}
        color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }

  _renderStateIcon(name, isSelected) {
    return (
      <Image
        source={StateIcons[name]}
        style={{height: 40, width: 40,}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  selectedTab: {
    color: Colors.tabIconSelected,
  },
});
