import React, { Component } from 'react';
import { Text, View, Image, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Toast, StatusBar } from 'react-native';
import UserApi from '../../services/UserApi';
import { Button } from 'native-base';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from "react-native-vector-icons/Feather";
import { simpleToast } from "../../services/utility/toastMessage";

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newpassword: "",
            password: "",
        }
    }

    ResetPassword = async () => {
        let { newpassword, password } = this.state;
        if (!newpassword && !password) {
            simpleToast('Please fill all the fields');
            simpleToast({
                text: "Please Fill Your Passwords !",
                buttonText: "Okay",
                textStyle: { color: globalStyle.thirdThemeColor },
                position: "bottom",
                // duration: 10000,
            })
        } else {
            if (newpassword !== null && newpassword !== "") {
                if (password !== null && password !== "") {
                    if (newpassword === password) {
                        await this.changepassword(newpassword, password);
                    } else {
                        simpleToast({
                            text: "Please enter same password",
                            buttonText: "Okay",
                            textStyle: { color: globalStyle.thirdThemeColor },
                            position: "bottom",
                            // duration: 10000,
                        })
                    }
                }
                else {
                    simpleToast({
                        text: "Please Enter Your Confirm Password !",
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                    simpleToast("Email is not correct");
                }
            } else {
                simpleToast({
                    text: "Please Enter your New Password",
                    buttonText: "Okay",
                    textStyle: { color: globalStyle.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
                simpleToast("Please enter your name");
            }
        }
    }

    changepassword = async (newpassword, password) => {
        console.log("insise change password function ***********************", newpassword, password)
        let data = {
            Password: newpassword,
            ConfirmPassword: password
        }
        try {
            let resp = await UserApi.modifyPassword(data);
            if (resp.statusCode == 200) {
                simpleToast('Password Changed Successfully');
                this.props.navigation.navigate('Login')
            } else {
                simpleToast('Please try again with different password');
            }

            console.log("modified password -------response", resp)
        } catch (error) {
            console.log(error);
        }
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
                                        style={{ marginLeft: 10, marginTop: 33 }}
                                        name="arrow-left"
                                        color="#fff"
                                        size={25}
                                    />
                                </TouchableOpacity>
                                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20,color:"#ffffff" }}>Reset Password</Text>
                                    <Image source={require('../../assets/Reset.png')} style={{ height: 60, width: 60, margin: 20 }} />
                                    <View style={{ justifyContent: 'center', }}>
                                        <Text style={{ fontSize: 22, color: "#ffffff", textAlign: 'center' }}>New Credential</Text>
                                        <Text style={{ textAlign: 'center', color: "#ffffff" }}>You already have been verified. Set your password</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#151515' }}>
                            <View style={styles.container2}>
                                {/* <Text style={styles.name}>Container1</Text> */}
                                <View style={{ marginTop: 80 }}>
                                    <View style={styles.action}>
                                        <Feather
                                            name="lock"
                                            style={{ color: "#ffffff" }}
                                            size={20}
                                        />
                                        <TextInput
                                            placeholder="Your Password"
                                            placeholderTextColor="#666666"
                                            // secureTextEntry={data.secureTextEntry ? true : false}
                                            style={[styles.textInput]}
                                            secureTextEntry={true}
                                            // style={{ width: '70%' }}
                                            onChangeText={(newpassword) => this.setState({ newpassword })}
                                            autoCapitalize="none"
                                            // secureTextEntry={this.state.isPasswordDisable}
                                            returnKeyType={"done"}
                                        />
                                    </View>

                                    <View style={styles.action}>
                                        <Feather
                                            name="lock"
                                            style={{ color: "#ffffff" }}
                                            size={20}
                                        />
                                        <TextInput
                                            placeholder="Confirm Password"
                                            placeholderTextColor="#666666"
                                            // secureTextEntry={data.secureTextEntry ? true : false}
                                            style={[styles.textInput]}
                                            secureTextEntry={true}
                                            // style={{ width: '70%' }}
                                            onChangeText={(password) => this.setState({ password })}
                                            autoCapitalize="none"
                                            // secureTextEntry={this.state.isPasswordDisable}
                                            returnKeyType={"done"}
                                        />
                                    </View>
                                    <Button block onPress={() => this.ResetPassword()} style={styles.registerUser}>
                                        <Text style={{ color: "white", fontSize: 18 }}>Update</Text>
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
    action: {
        flexDirection: "row",
        margin: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? 0 : -12,
        paddingLeft: 10,
        color: "#ffffff",
        fontSize: 15,
        flex: 1
    },
    otpInput: {
        height: '65%',
        width: '10%',
        backgroundColor: 'white',
        margin: '2%',
        elevation: 10,
        textAlign: 'center',
    },
})