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

import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import Router from '../navigation/Router';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import {
  FriendsWhoLiveUrls,
  StateIcons,
} from '../Data';

const stateNames = {
  FL: 'Florida',
  OH: 'Ohio',
  PA: 'Pennsylvania',
}

export default class StateScreen extends React.Component {
  static route = {
    navigationBar: {
      title(params) {
        return `Friends in ${stateNames[params.state]}`;
      },
    },
  }

  render() {
    let { state } = this.props.route.params;

    let injectedJavaScript = `
      require('DOM').listen(document.body, 'click', null, function(e) {
      var target = e.getTarget();
      var link = target.parentNode;
      var path = link.pathname;
      if (!path) {
        return;
      }

      var result = /^https:\\/\\/m\\.facebook\\.com\\/messages\\/thread\\/([\\d]+)\\//.exec(href);
      if (!result) {
        return;
      }

      e.prevent();

      var id = result[1];
      window.location = "#message-" + id;
      console.log('id is', id);
    });`

    return (
      <WebView
        source={{ uri: FriendsWhoLiveUrls[state] }}
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
