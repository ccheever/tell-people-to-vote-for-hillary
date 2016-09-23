import React, {
  PropTypes
} from 'react';
import {
  DeviceEventEmitter,
  Image,
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
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import {
  FriendsWhoLiveUrls,
  StateIcons,
} from '../Data';

let st = 'OH';

export default class RootNavigation extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

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

        {['OH', 'PA', 'FL'].map((st) => {
          return (
            <TabNavigationItem
              key={st}
              id={st}
              renderIcon={isSelected => this._renderStateIcon(st, isSelected)}>
              <WebView
                source={{uri: FriendsWhoLiveUrls[st]}}
                style={{marginTop: 20}}
              />
            </TabNavigationItem>
          );
        })}

        {/*

        <TabNavigationItem
          id="links"
          renderIcon={isSelected => this._renderIcon('book', isSelected)}>
          <StackNavigation initialRoute={Router.getRoute('links')} />
        </TabNavigationItem>

        <TabNavigationItem
          id="settings"
          renderIcon={isSelected => this._renderIcon('cog', isSelected)}>
          <StackNavigation initialRoute={Router.getRoute('settings')} />
        </TabNavigationItem>

        */}
        
      </TabNavigation>
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

  _registerForPushNotifications() {
    const { notification } = this.props;

    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // If we started the app from a push notification, handle it right away
    notification && this._handleNotification(notification);

    // Handle notifications that come in while the app is open
    return DeviceEventEmitter.addListener('Exponent.notification', this._handleNotification);
  }

  _handleNotification = ({origin, data}) => {
    this.props.navigator.showLocalAlert(
      `Push notification ${origin} with data: ${data}`,
      Alerts.notice
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