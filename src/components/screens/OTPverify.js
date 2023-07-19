import React, { Component } from 'react';
import { Text, View, Image, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import UserApi from '../../services/UserApi';
import { Button } from 'native-base';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { simpleToast } from "../../services/utility/toastMessage";
import Feather from 'react-native-vector-icons/Feather';

export default class OTPverify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            phoneNo: "",
            verifyOTP: false,
        }
    }

    sendOTP = async () => {
        const { email, phoneNo } = this.state;
        // let reg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (phoneNo != "") {
            if (phoneNo.length == 10) {
                let resp = await UserApi.getOtpPhone(phoneNo);
                console.log("response of Otp verify ===", resp);
                if (resp.statusCode == 200) {
                    simpleToast('OTP has been sent to your registered Mobile Number');
                    this.props.navigation.navigate("Verification")
                }
            }
            else if (reg.test(email) == true) {

            }
            else {
                simpleToast("Please enter a valid field");
            }
        }
        else {
            simpleToast("Please enter the field");
        }
        // let response = await UserApi.getOtpEmail(this.state.email, this.state.props);
        // this.setState({ verifyOTP: true })
    }

    render() {
        return (
            <SafeAreaView>
                <StatusBar translucent backgroundColor='transparent' />
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ backgroundColor: '#0cad95' }}>
                            <View style={styles.container1}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Feather
                                        style={{marginTop: 33, marginLeft: 10 }}
                                        name="arrow-left"
                                        color="#fff"
                                        size={25}
                                    />
                                </TouchableOpacity>
                                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20,color: '#ffffff', }}>OTP Verification</Text>
                                    <Image source={require('../../assets/verify2.png')} style={{ height: 100, width: 100, margin: 10 }} />
                                    <View style={{ justifyContent: 'center', }}>
                                        <Text style={{ fontSize: 22, color: "#ffffff", textAlign: 'center' }}>Forgot Your Password</Text>
                                        <Text style={{ textAlign: 'center', color: "#ffffff" }}>Please enter your email address / Phone Number to receive One Time Password</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#151515' }}>
                            <View style={styles.container2}>
                                {/* <Text style={styles.name}>Container1</Text> */}
                                <View style={{ marginTop: 80 }}>
                                    <TextInput
                                        placeholder="India (+91)"
                                        placeholderTextColor="#222f3e"
                                        style={[styles.textinput], { borderBottomWidth: 1 }}
                                        autoCapitalize="none"
                                        onChangeText={(phoneNo) => this.setState({ phoneNo: phoneNo })}
                                        keyboardType={"phone-pad"}
                                    />
                                    <Text style={{ textAlign: 'center', marginTop: 30, marginBottom: -10 }}>OR</Text>
                                    <TextInput
                                        placeholder="Email"
                                        placeholderTextColor="#222f3e"
                                        // secureTextEntry={data.secureTextEntry ? true : false}
                                        style={[styles.textInput], { borderBottomWidth: 1 }}
                                        autoCapitalize="none"
                                        onChangeText={(email) => this.setState({ email })}
                                        keyboardType={"email-address"}

                                    />

                                    <Button block onPress={() => this.sendOTP()} style={styles.registerUser}>
                                        <Text style={{ color: "white", fontSize: 18 }}>Get OTP</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#282828',
    },
    container1: {
        backgroundColor: '#151515',
        height: hp('50%'),
        padding: 10,
        // borderBottomLeftRadius:100,
    },
    container2: {
        backgroundColor: '#dcdde1',
        height: hp('60%'),
        padding: 10,
        borderTopLeftRadius: 100,
    },
    registerUser: {
        marginTop: 30,
        backgroundColor: '#151515',
        borderRadius: 5,
        elevation: 1,
        borderColor: '#151515',
        borderWidth: .5,
        elevation: 5
    }
    // container: {
    //     flex: 1,
    //     backgroundColor: '#282828'
    // },
    // otpInput: {
    //     height: '65%',
    //     width: '10%',
    //     backgroundColor: 'white',
    //     margin: '2%',
    //     elevation: 10,
    //     textAlign: 'center',
    // },
    // OTP: {
    //     fontWeight: 'bold',
    //     fontSize: 22,
    //     color: "#ffffff",
    //     textAlign: 'center',
    //     marginTop: 20,
    // }
})
