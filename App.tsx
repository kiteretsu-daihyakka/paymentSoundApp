/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  PermissionsAndroid,
  View,
  DeviceEventEmitter,
} from 'react-native';
import Tts from 'react-native-tts';
import BackgroundFetch from 'react-native-background-fetch';

// import SmsAndroid from 'react-native-get-sms-android';
// import SmsListener from 'react-native-android-sms-listener';

function App(): React.JSX.Element {
  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

  BackgroundFetch.configure(
    {
      minimumFetchInterval: 0, // minimum interval in minutes
      stopOnTerminate: false, // continue running after the app is terminated
      startOnBoot: true, // start when the device boots up
    },
    async taskId => {
      readAmountReceivedMessage();
      console.log(`Background task with ID ${taskId} executed`);
      BackgroundFetch.finish(taskId); // signal task completion
    },
  );

  const requestSmsPermission = async () => {
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      setReceiveSmsPermission(permission);
    } catch (err) {
      console.log(err);
    }
  };
  const readAmountReceivedMessage = () => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      // Tts.setDefaultVoice('hi-in-x-hie-local'); // male // Tts.setDefaultVoice('hi-in-x-hia-local'); // slow female
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        message => {
          const {messageBody} = JSON.parse(message);
          if (!messageBody.toLowerCase().includes('NAVNIRMAN')) {
            return;
          }
          Tts.getInitStatus().then(() => {
            let pattern = /Rs.\d+/;
            let RS_amount = messageBody.match(pattern)[0];
            let amount = RS_amount.match(/\d+/)[0];
            console.log({amount});
            let payment_received_msg = amount + ' रुपे ' + ' प्राप्त हुऐ!';
            // let payment_received_msg = amount + " Rupees " + " received."
            Tts.speak(payment_received_msg);
          });
          Tts.stop();
        },
      );

      return () => {
        subscriber.remove();
      };
    }
  }
  useEffect(() => {
    requestSmsPermission();
    Tts.setDucking(true);
    Tts.setDefaultLanguage('hin-IN');
    BackgroundFetch.start(); // Start the background task
  }, []);

  useEffect(() => {
    readAmountReceivedMessage();
  }, [receiveSmsPermission]);

  return (
    <SafeAreaView>
      <View></View>
    </SafeAreaView>
  );
}

export default App;
