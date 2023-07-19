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

export default class Verification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phoneNo: "",
            otp: "",
            verifyOTP: false,
        }
    }

    Verification = async () => {
        const { otp } = this.state;
        console.log("your otp     ===    ", otp)
        console.log("inside varify otp with email***********************", otp)
        this.props.navigation.navigate("ResetPassword")
        try {
            let resp = await UserApi.varifyOtpPhone(otp, "9799188519");
            if (resp.statusCode == 200) {
                simpleToast('OTP Varification Successfully');
                this.props.navigation.navigate('ResetPassword');
            }
            console.log("generate otp-------response", resp)
        } catch (error) {
            console.log(error);
        }
        this.setState({ otp: "" })

    }

    render() {
        const { otp } = this.state
        return (
            <SafeAreaView>
                <StatusBar translucent backgroundColor='transparent' />
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ backgroundColor: '#0cad95' }}>
                            <View style={styles.container1}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Feather
                                        style={{ marginLeft: 10, marginTop: 33 }}
                                        name="arrow-left"
                                        color="#fff"
                                        size={25}
                                    />
                                </TouchableOpacity>
                                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, color:'#ffffff' }}>OTP Verification</Text>
                                    <Image source={require('../../assets/OTPPP.png')} style={{ height: 100, width: 100, margin: 20 }} />
                                    <View style={{ justifyContent: 'center', }}>
                                        <Text style={{ fontSize: 22, color: "#ffffff", textAlign: 'center' }}>Verification Code</Text>
                                        <Text style={{ textAlign: 'center', color: "#ffffff" }}>OTP has been sent to your Email/Phone . Please verify</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#151515' }}>
                            <View style={styles.container2}>
                                {/* <Text style={styles.name}>Container1</Text> */}
                                <View style={{ marginTop: 80 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                                        <TextInput ref='1Digit' maxLength={1} underlineColorAndroid="#a30007" keyboardType='number-pad' style={styles.otpInput}
                                            onChangeText={(text) => {
                                                if (text != '') {
                                                    this.setState({ otp: otp + text })
                                                    this.refs.Digit2.focus();
                                                }
                                            }}
                                        />
                                        <TextInput ref='Digit2' maxLength={1} underlineColorAndroid="#a30007" keyboardType='number-pad' style={styles.otpInput}
                                            onChangeText={(text) => {
                                                if (text != '') {
                                                    this.setState({ otp: otp + text })
                                                    this.refs.Digit3.focus();
                                                }
                                            }}
                                        />
                                        <TextInput ref='Digit3' maxLength={1} underlineColorAndroid="#a30007" keyboardType='number-pad' style={styles.otpInput}
                                            onChangeText={(text) => {
                                                if (text != '') {
                                                    this.setState({ otp: otp + text })
                                                    this.refs.Digit4.focus();
                                                }
                                            }}
                                        />
                                        <TextInput ref='Digit4' maxLength={1} underlineColorAndroid="#a30007" keyboardType='number-pad' style={styles.otpInput}
                                            onChangeText={(text) => {
                                                if (text != '') {
                                                    this.setState({ otp: otp + text })
                                                    this.refs.Digit5.focus();
                                                }
                                            }}
                                        />
                                        <TextInput ref='Digit5' maxLength={1} underlineColorAndroid="#a30007" keyboardType='number-pad' style={styles.otpInput}
                                            onChangeText={(text) => {
                                                if (text != '') {
                                                    this.setState({ otp: otp + text })
                                                    this.refs.Digit6.focus();
                                                }
                                            }}
                                        />
                                        <TextInput ref='Digit6' maxLength={1} underlineColorAndroid="#a30007" keyboardType='number-pad' style={styles.otpInput}
                                            onChangeText={(text) => {
                                                if (text != '') {
                                                    this.setState({ otp: otp + text })

                                                }
                                            }}
                                        />
                                    </View>

                                    <Button block onPress={() => this.Verification()} style={styles.registerUser}>
                                        <Text style={{ color: "white", fontSize: 18 }}>Verify</Text>
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
    },
    // container: {
    //     flex: 1,
    //     backgroundColor: '#282828'
    // },
    otpInput: {
        height: '65%',
        width: '10%',
        backgroundColor: 'white',
        margin: '2%',
        elevation: 10,
        textAlign: 'center',
    },
    // OTP: {
    //     fontWeight: 'bold',
    //     fontSize: 22,
    //     color: "#ffffff",
    //     textAlign: 'center',
    //     marginTop: 20,
    // }
})