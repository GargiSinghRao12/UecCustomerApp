import { Linking, Alert, Platform } from "react-native";

export const MakeCallSanatan = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    }
    else {
        phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                Alert.alert(
                    'Contact Sanatan Team',
                    'Are you sure you want to call Sanatan?',
                    [
                        { text: 'Cancel', onPress: () => { return null } },
                        {
                            text: 'Call', onPress: () => { return Linking.openURL(phoneNumber); }
                        },
                    ],
                    { cancelable: false }
                )
            }
        })
        .catch(err => console.log(err));
};