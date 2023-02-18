import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, Text, StatusBar, View, Button, Alert } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true
    }
  }
})
GoogleSignin.configure({
  webClientId: '83777873421-iudgolpqeg7mree6c07fk130ki3mpu9k.apps.googleusercontent.com',
});
function App() {
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const signIn = async () => {
   

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn()
      console.log("ashwani" + JSON.stringify(userInfo))
      setname(userInfo.user.name)
      setemail(userInfo.user.email)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancel 
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // IN_PROGRESS
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // PLAY_SERVICES_NOT_AVAILABLE
      } else {
        // some other 
      }
    }
  };
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('Authorization status:', authStatus);
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };
  const [PushToken, setPushToken] = useState()
  useEffect(() => {
    if (requestUserPermission()) {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      });
      const [FCMTOKEN, setFCMTOKEN] = useState('')
      messaging().getToken().then((fcmToken) => { Alert.alert('FCM token =>', fcmToken); setFCMTOKEN(fcmToken) });
    } else console.log('Not AuthorizationStatus :', authStatus)
    // Permissions.getAsync(Permissions.NOTIFICATIONS).then(statusObj => {
    //   if (statusObj.status !== 'granted') {
    //     return Permissions.askAsync(Permissions.NOTIFICATIONS);
    //   }
    //   return statusObj;
    // }).then(statusObj => {
    //   if (statusObj.status !== 'granted') {
    //     throw new Error('Permissions not granted');
    //   }
    // })
    //   .then(() => {
    //     return Notifications.getExpoPushTokenAsync();
    //   })
    //   .then(response => {
    //     const Token = response.data;
    //     setPushToken(Token)
    //     console.log("Token ==> " ,Token)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     return null;
    //   })
  }, []);
  // useEffect(() => {
  //   const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });
  //   const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
  //     console.log(notification);
  //   });
  //   return () => {
  //     backgroundSubscription.remove();
  //     foregroundSubscription.remove();
  //   }
  // }, []);
  const notifactionshow = () => {
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: 'first Local Notifaction',
    //     body: 'this is the first local button notifaction ..'
    //   },
    //   trigger: {
    //     seconds: 3,
    //   }
    // })
    // fetch('https://exp.host/--/api/v2/push/send', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Accept-Encoding': 'gzip,deflate',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     to: PushToken,
    //     data: { extraData: 'extradata' },
    //     title: 'Send Vs the App',
    //     body: 'this push notifaction vs the app '
    //   })
    // });


  }
  return (
    <><StatusBar backgroundColor={'black'} />
      <View style={{ marginTop: 20 }}>
        <Button title='popup' onPress={notifactionshow} />
       
        {/* <Text> {FCMTOKEN}</Text> */}
        <Text>{name}</Text>
        <Text>{email}</Text>
      </View>
      <View>
        <GoogleSigninButton
          style={{ width: 312, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={() => signIn()}
        />
      </View>
    </>

  );
}

export default App;
