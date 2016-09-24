import React, {
  PropTypes
} from 'react';
import {
  DeviceEventEmitter,
  Image,
  Linking,
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

    /*
    injectedJavaScript={"alert('injected');var elts = document.getElementsByTagName('A'); var count = 0; for (var i = 0; i < elts.length; i++) { var elt = elts[i]; var href = elt.href; var result = /^https:\\/\\/m\\.facebook\\.com\\/messages\\/thread\\/([\\d]+)\\//.exec(href); //console.log(href); if (result) { var id = result[1]; elt.href = 'fb-messenger://user/' + id; count++; } }"}
    */

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

          let injectedJavaScript = `
          document.body.scrollTop = 45;
          window.addEventListener('click', function (e) {
            var target = e.target;
            var link = target.parentNode;
            var href = link.href;
            var result = /^https:\\/\\/m\\.facebook\\.com\\/messages\\/thread\\/([\\d]+)\\//.exec(href);
            if (result) {
               var id = result[1];
               window.location = "#message-" + id;
               setTimeout(function () {
                 window.history.back();
               }, 100);
            }
          });

          `;
          return (
            <TabNavigationItem
              key={st}
              id={st}
              renderIcon={isSelected => this._renderStateIcon(st, isSelected)}>
              <WebView
                source={{uri: FriendsWhoLiveUrls[st]}}
                style={{marginTop: 20}}
                injectedJavaScript={injectedJavaScript}

                onNavigationStateChange={(opts) => {
                  // console.log("onNavigationStateChange", opts);
                  let {url} = opts;
                  let result = /https:\/\/m\.facebook\.com\/.*#message-([\d]+)/.exec(url);
                  if (result) {
                    let id = result[1];
                    console.log("Opening message thread with " + id);
                    Linking.openURL('fb-messenger-public://user-thread/' + id);
                    return false;
                  } else {
                    // console.log("Not a message thread");
                  }
                }}
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
