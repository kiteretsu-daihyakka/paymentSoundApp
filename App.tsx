/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import {soundSettings} from './components/functions/speakMessage.jsx';
import {requestSmsPermission} from './components/functions/permissionReadSMS.jsx';
import {readAmountReceivedMessage} from './components/functions/readspeakMessage.jsx';

// import SmsAndroid from 'react-native-get-sms-android';
// import SmsListener from 'react-native-android-sms-listener';

function App(): React.JSX.Element {
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        await sleep(delay);
      }
    });
  };
  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };
  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

  useEffect(() => {
    setReceiveSmsPermission(requestSmsPermission(receiveSmsPermission));
  }, []);
  useEffect(() => {
    soundSettings();
    readAmountReceivedMessage();
    BackgroundService.start(veryIntensiveTask, options);
  }, []);

  return (
    <SafeAreaView>
      <View></View>
    </SafeAreaView>
  );
}

export default App;
