import React from 'react';
import {
  Clipboard,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  WebView,
} from 'react-native';

import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

import { MonoText } from '../components/StyledText';
import Alerts from '../constants/Alerts';
import {
  Messages,
} from '../Data';

let {height, width} = Dimensions.get('window');

export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Vote Plz',
    },
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoggedIn: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          {
            this.state.isLoggedIn ?
              this._renderMainView() :
              this._renderLogin()
          }
        </ScrollView>
      </View>
    );
  }

  _renderLogin() {
    return (
      <View style={styles.login}>
        <Text style={styles.fbLoginTitle}>
          First, log into Facebook so you can select from your friends.
        </Text>
        <View style={styles.fbWebViewContainer}>
          <WebView
            source={{ uri: 'https://m.facebook.com/login.php' }}
            decelerationRate="normal"
            onNavigationStateChange={this._handleNavigationStateChange}
            style={styles.fbWebView}
          />
        </View>
      </View>
    );
  }

  _renderMainView() {
    return (
      <View style={styles.messages}>
        <Text>Tap a message to copy it to your clipboard.</Text>
        { Messages.map(message => this._renderMessage(message)) }
        <Text style={styles.messageInstructions}>
          Then use the tabs below to find friends in swing states to reach out to.
        </Text>
      </View>
    );
  }

  _renderMessage(message) {
    return (
      <TouchableBounce
        onPress={() => {
          Clipboard.setString(message);
          this.props.navigator.showLocalAlert(
            `Copied message to clipboard`,
            Alerts.notice,
          );
        }}
        style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </TouchableBounce>
    );
  }

  _handleNavigationStateChange = (event) => {
    let { url } = event;
    let isLoginPage = url.indexOf('/login.php') !== -1;
    this.setState({ isLoggedIn: !isLoginPage });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 0,
  },
  login: {
    flex: 1,
  },
  fbLoginTitle: {
    marginTop: 12,
    marginBottom: 3,
    textAlign: 'center',
  },
  fbWebViewContainer: {
    borderWidth: 2,
    borderColor: 'rgba(64, 122, 255, 0.5)',
    flex: 1,
    margin: 6,
  },
  fbWebView: {
  },
  messages: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  messageContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#407AFF',
    borderRadius: 6,
    margin: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  messageText: {
    color: 'white',
    fontSize: 12,
  },
  messageInstructions: {
    marginTop: 15,
    paddingHorizontal: 10,
    textAlign: 'center',
  }
});
