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

let {height, width} = Dimensions.get('window');

import Alerts from '../constants/Alerts';

import {
  Messages,
} from '../Data';


let messageToCopy = `
I'm reaching out to friends who live in swing states to remind them to register to vote because your vote counts for a lot. Would you check your registration status at voteplz.org (http://voteplz.org/) before the October 11th deadline passes?

Since this election is so important, I hope you don't mind that I check in again if I don't hear back.
`;

export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  constructor(props, context) {
    super(props, context);
    this.state ={
      collapseWebView: false,
    };
  }


  render() {
    let webViewHeight = 300;
    if (this.state.collapseWebView) {
      webViewHeight = 0;
    }
    return (
      <View style={styles.container}>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <WebView
            source={{uri: 'https://m.facebook.com/login.php'}}
            style={{marginTop: 3, width: width, height: webViewHeight,}}
            onNavigationStateChange={(opts) => {
              let {url} = opts;
              if (/login\.php/.exec(url)) {
                this.setState({collapseWebView: false,});
              } else {
                this.setState({collapseWebView: true,});
              }
            }}


          />

        {/*
        <TouchableBounce onPress={() => {
            // Somehow send user to http://facebook.com/n/?mid=6e0ddd1G5af3c170a5b3Gbef704G
        }}>
          <View style={{
              backgroundColor: 'blue',
          }}>
            <Text>Logout</Text>
          </View>
        </TouchableBounce>
        */}



{/*
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/exponent-wordmark.png')}
              style={styles.welcomeImage}
            />
          </View>


          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>
              Get started by opening
            </Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                Help, it didn’t automatically reload!
              </Text>
            </TouchableOpacity>
          </View>

          */}

          <View style={{
              alignItems: 'center',
          }}>
              <Text>Tap to copy message to Clipboard</Text>
              {Messages.map((message) => {
                return (
                  <View style={{
                      borderRadius: 6,
                      margin: 6,
                      backgroundColor: '#407AFF',
                      padding: 6,
                  }}>
                    <TouchableBounce onPress={() => {
                        Clipboard.setString(message);
                        this.props.navigator.showLocalAlert(
                          `Copied message to clipboard`,
                          Alerts.notice
                        );
                    }}>
                      <Text style={{
                          fontSize: 12,
                          color: 'white',
                      }}>{message}</Text>
                    </TouchableBounce>
                  </View>
                );
              })}
            <Text style={{
                marginTop: 15,
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}>Then use the tabs below to find friends in swing states to reach out to</Text>

            {/*
            <TextInput
              multiline = {true}
              numberOfLines={4}
              value={messageToCopy}
              style={{
                margin: 20,
                padding: 10,
                fontSize: 18,
                flex: 1,
                width: width,
                height: height - 100,
              }}
            />
            */}
          </View>

        </ScrollView>

        {/*
        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>
            This is a tab bar. You can edit it in:
          </Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/RootNavigation.js</MonoText>
          </View>
        </View>
        */}


      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will run slightly slower but
          you have access to useful development tools. {learnMoreButton}.
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    Linking.openURL('https://docs.getexponent.com/versions/latest/guides/development-mode');
  }

  _handleHelpPress = () => {
    Linking.openURL('https://docs.getexponent.com/versions/latest/guides/up-and-running.html#can-t-see-your-changes');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 15,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 80,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 200,
    height: 34.5,
    marginTop: 3,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
