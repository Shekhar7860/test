import App from './App';
import {AppRegistry,YellowBox} from 'react-native';
import {name as appName} from './app.json';

YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated'
  ]);
  console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);