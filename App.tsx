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
import BackgroundService from 'react-native-background-actions';

// import SmsAndroid from 'react-native-get-sms-android';
// import SmsListener from 'react-native-android-sms-listener';

function App(): React.JSX.Element {
  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');

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
  const readAmountReceivedMessage = async () => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      Tts.setDefaultVoice('hi-in-x-hie-local'); // male // Tts.setDefaultVoice('hi-in-x-hia-local'); // slow female
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        message => {
          const {messageBody} = JSON.parse(message);
          if (!messageBody.toLowerCase().includes('navnirman')) {
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
  useEffect(() => {
    requestSmsPermission();
    Tts.setDucking(true);
    Tts.setDefaultLanguage('hin-IN');
    // Start the background task
  }, []);

  useEffect(() => {
    console.log('coming in use effect.')
    BackgroundService.start(readAmountReceivedMessage,options);
  }, [receiveSmsPermission]);

  return (
    <SafeAreaView>
      <View></View>
    </SafeAreaView>
  );
}

export default App;
