// /**
//  * @format
//  */
// import 'react-native-gesture-handler';
// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);


/**
 * @format
 */
 import React from "react";
 import { AppRegistry } from 'react-native';
 import App from './App';
 import { name as appName } from './app.json';
 import { Root } from 'native-base';
 
 const RootApp = () => (
     <Root>
         <App />
     </Root>
 );
 
 AppRegistry.registerComponent(appName, () => RootApp);
 