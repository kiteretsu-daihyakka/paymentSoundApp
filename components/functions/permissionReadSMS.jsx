import {PermissionsAndroid} from 'react-native';

export const requestSmsPermission = async (granted) => {
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      return permission;
    } catch (err) {
      console.log(err);
    }
  }else{
    return PermissionsAndroid.RESULTS.GRANTED;
  }
};
