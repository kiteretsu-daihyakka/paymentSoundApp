import { PermissionsAndroid, DeviceEventEmitter} from 'react-native';

export const readAmountReceivedMessage = async () => {
    if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
      let subscriber = DeviceEventEmitter.addListener(
        'onSMSReceived',
        message => {
          const {messageBody} = JSON.parse(message);
          if (!messageBody.toLowerCase().includes('navnirman')) {
            return;
          }

          let pattern = /Rs.\d+/;
          let RS_amount = messageBody.match(pattern)[0];
          let amount = RS_amount.match(/\d+/)[0];
          console.log({amount});
          let payment_received_msg = amount + ' रुपे ' + ' प्राप्त हुऐ!';
          // let payment_received_msg = amount + " Rupees " + " received."
          speakMessage(payment_received_msg);
        },
      );

      return () => {
        subscriber.remove();
      };
    }
  };