import React from 'react';
import {
  Linking,
  StyleSheet,
  View,
  WebView,
} from 'react-native';

import {
  FriendsWhoLiveUrls,
} from '../Data';

const stateNames = {
  FL: 'Florida',
  OH: 'Ohio',
  PA: 'Pennsylvania',
};

export default class StateScreen extends React.Component {
  static route = {
    navigationBar: {
      title(params) {
        return `Friends in ${stateNames[params.state]}`;
      },
    },
  };

  render() {
    let { state } = this.props.route.params;

    let injectedJavaScript = `
      requireLazy(['DOM'], function(DOM) {
        DOM.listen(document.body, 'click', null, function(e) {
          debugger;
          var target = e.getTarget();
          var link = target.parentNode;
          if (!link.href) {
            return;
          }

          var matches;
          if (link.hash.startsWith('#!/')) {
            matches = /^#!\\/messages\\/thread\\/(\\d+)\\//.exec(link.hash);
          } else {
            matches = /^\\/messages\\/thread\\/(\\d+)\\//.exec(link.pathname);
          }

          if (!matches) {
            return;
          }

          e.prevent();

          var id = matches[1];
          window.location = '#message-' + id;
        });
      });
    `;

    return (
      <WebView
        source={{ uri: FriendsWhoLiveUrls[state] }}
        style={styles.container}
        injectedJavaScript={injectedJavaScript}
        onNavigationStateChange={this._handleNavigationStateChange}
      />
    );
  }

  _handleNavigationStateChange = (event) => {
    let { url } = event;
    let matches = /https:\/\/m\.facebook\.com\/.*#message-([\d]+)/.exec(url);
    if (!matches) {
      return;
    }

    let id = matches[1];
    console.log('Opening message thread with:', id);
    Linking.openURL('fb-messenger-public://user-thread/' + id).catch(error => {
      console.warn(error.message);
    });
    return false;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
