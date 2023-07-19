import React from 'react';
import { BackHandler, StyleSheet, View, Dimensions, TouchableOpacity, Share, Image, Modal, Text, Alert, Picker, SafeAreaView, ScrollView } from 'react-native';
import RupeeIcon from 'react-native-vector-icons/FontAwesome'
import ErrorIcon from 'react-native-vector-icons/MaterialIcons'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
const { height, width } = Dimensions.get('window')
import { globalStyles } from '../styles/globalStyles';
import { TextInput } from 'react-native-gesture-handler';
import UserApi from '../../services/UserApi';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import WaitingLoader from './WaitingLoader';
// import { Clipboard } from 'react-native';
import CopyIcon from 'react-native-vector-icons/MaterialIcons'
import { Toast } from 'native-base';
import ShareIcon from 'react-native-vector-icons/Entypo'
import WhatsappIcon from 'react-native-vector-icons/FontAwesome'
import FacebookIcon from 'react-native-vector-icons/Entypo'
import TwitterIcon from 'react-native-vector-icons/AntDesign'
import AppConfig from '../constants/AppConfig';
import { simpleToast } from "../../services/utility/toastMessage";

// const shareOptions = {
//     title: 'Title',
//     message: AppConfig.REFERRAL_LINK, // Note that according to the documentation at least one of "message" or "url" fields is required
//     // url: 'www.example.com',
//     // subject: 'Subject'
//   };



export default class ShareScreen extends React.Component {
    // onSharePress = () => Share.share();
    constructor(props) {
        super(props);
        this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
        this.state = {
            waitingLoaderVisible: false,
            isLoading: false,
            referralCode: "",
        }
    }

    navigateToback = () => {
        this.props.navigation.goBack();
    }

    onBackButtonPressed() {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount = async () => {
        this.getReferralCode();
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
    }

    getReferralCode = async () => {
        let response = await UserApi.getReferral(this.props);
        // console.log("response@@@@@@", response)
        if (response && response.userCode !== null && response.userCode !== undefined) {
            this.setState({ referralCode: response.userCode })
        } else if (response.error) {
            simpleToast({
                text: response.error,
                buttonText: "Okay",
                textStyle: { color: globalStyles.thirdThemeColor },
                position: "bottom",
                duration: 5000,
            })
        }
    }

    _shareApp = async () => {
        await Share.share({
            title: 'Title',
            message: 'Join me on Sanatan Bazaar, A secure app for delivery fruits and vegetables. Enter my code: "' + this.state.referralCode + '", To get your First Order ' + AppConfig.REFERRAL_LINK, // Note that according to the documentation at least one of "message" or "url" fields is required
            // url: AppConfig.REFERRAL_LINK,
            // subject: 'Subject'
        });
    };

    // onShare = async () => {
    //     try {
    //       await Share.share({
    //         title: 'React Native Share',
    //         message:  
    //         AppConfig.REFERRAL_LINK,
    //         //   'Let me share this text with other apps',
    //       });

    //     } catch (error) {
    //       console.log(error.message);
    //     }
    //   };

    copyText = async () => {
        Clipboard.setString(this.state.referralCode)
        simpleToast({
            text: 'Message Copied',
            buttonText: "Okay",
            // textStyle: { color: globalStyles.thirdThemeColor },
            position: "bottom",
            // duration: 10000,
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
                    <View style={{ flex: 1, justifyContent: "center" }}>
                
                         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: globalStyles.orangeThemeColor}}>
                         <Image style={styles.logoStyle} source={require('../../assets/refer.png')} />
                         <Text style={{fontSize:20}}>Invite Your Friend</Text>
                         </View>


                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor:"gray" }}>
                            <Text style={{ color: "black" }}>Your Referral Code</Text>
                            <TouchableOpacity onPress={this.copyText} activeOpacity={0.9} style={styles.shareStyle}>
                                <View style={{ flex: 1, alignItems: "center" }}>
                                    <Text style={{ color: globalStyles.primaryThemeColor, fontSize: 12 }}>{this.state.referralCode}</Text>
                                </View>
                                <View style={{ backgroundColor: globalStyles.primaryThemeColor, alignItems: "center", flexDirection: "row", height: wp("15"), flex: 1, justifyContent: "space-evenly" }}>
                                    <CopyIcon name="content-copy" size={25} color="#011e45" />
                                    <Text style={{ color: "white" }}>Tap To copy</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: .5, alignItems: "center", backgroundColor:"gray" }}>
                            {/* <TouchableOpacity onPress={this.onSharePress} >
                        <WhatsappIcon name="whatsapp" size={30} color="#4AC959" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FacebookIcon name="facebook" size={30} color="#3b5998" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <TwitterIcon name="twitter" size={30} color="#00acee" />
                    </TouchableOpacity> */}
                            <TouchableOpacity onPress={this._shareApp} activeOpacity={.9} style={{ width: wp("35%"), flexDirection: 'row', backgroundColor: "#f8f8ff", justifyContent: "space-between", padding: 10, elevation: 5, borderRadius: 10, alignItems: "center" }}>
                                <Text style={{ fontSize: 15, padding: 20 }}>Share With</Text>
                                <ShareIcon name="share" size={30} color="#011e45" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.state.waitingLoaderVisible &&
                        <WaitingLoader visible={this.state.waitingLoaderVisible} isLoading={this.state.isLoading} />
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoStyle: {
        height: wp("50%"),
        width: wp("80%"),
        alignSelf: "center",
        borderRadius: 5,
    },
    shareStyle: {
        flexDirection: "row",
        borderRadius: 5,
        borderColor: globalStyles.primaryThemeColor,
        borderWidth: 1,
        margin: 10,
        justifyContent: "space-evenly",
        alignItems: "center",
        height: wp("15"),
        width: wp("70")
    }
});


