/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import "react-native-get-random-values";
import { Buffer } from "buffer";
global.Buffer = Buffer;

// Place the App component import below your polyfill imports!
AppRegistry.registerComponent(appName, () => App);
