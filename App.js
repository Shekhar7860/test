import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import configureStore from './src/configureStore';
import firebase from 'react-native-firebase';
import { AppContainer } from "./router";
const store = configureStore();
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      signIn: false,
      token: null
    };
    this.socket;
  }


  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    this.checkPermission();
    AsyncStorage.getItem('user').then((keyValue) => {
      if (JSON.parse(keyValue) != null) {
        const userData = JSON.parse(keyValue);
        this.setState({ signIn: true, token: userData.accessToken })
      }
      else {
        this.setState({ signIn: false })
      }
    }, (error) => {
      console.log(error)
    });
  
  }


  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log('fcmToken:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('fcmToken:', fcmToken);
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    debugger
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }

  render() {
    let { signIn, token } = this.state;
    const AppRouter = AppContainer(signIn);
    let screenProps = {};
    return (
      <Provider store={store}>
        {
          this.state.signIn === null ? <View /> :
            <AppRouter
              screenProps={{
                socketConnection: token => this.socketConnection(token),
                getSocket: this.getSocket
              }}
            />
        }
      </Provider>
    );
  }
}
