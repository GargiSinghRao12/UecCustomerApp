import React, { Component } from "react";
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Image, ImageBackground, Animated, Dimensions, } from "react-native";
import UserApi from "../../services/UserApi";
import { globalStyles } from "../styles/globalStyles";
import {
  BackHandler,
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Icon,
  Toast,
  Row,
} from "native-base";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonApi from "../../services/CommonApi";
import Feather from "react-native-vector-icons/Feather";
import { cleanStorage, setItem, setItemJson, StorageKeys } from "../../services/localstore/StorageService";
import { TypingAnimation } from 'react-native-typing-animation';
import * as Animatable from 'react-native-animatable';
import { simpleToast } from "../../services/utility/toastMessage";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.state = {
      isLoading: false,
      waitingLoaderVisible: false,
      showPassword: true,
      press: false,
      username: "",
      password: "",
      icon: "eye-off",
      isPasswordDisable: true,
      AddressData: [],
      typing_email: false,
      typing_password: false,
      animation_login: new Animated.Value(width - 40),
      enable: true

    };
  }

  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  validate = async () => {
    let reg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let { username, password } = this.state;
    console.log("@@", username, password);
    if (!username && !password) {
      // simpleToast('Please fill all the fields');
      simpleToast({
        text: "Please fill all the fields!",
        buttonText: "Okay",
        textStyle: { color: globalStyles.thirdThemeColor },
        position: "bottom",
        // duration: 10000,
      });
    } else {
      if (reg.test(username) == true) {
        if (password != null && password != "") {
          console.log("Password not null", this.state)
          await this.signIn(username, password);
        } else {
          // simpleToast('Enter your password');
          simpleToast({
            text: "Enter your password!",
            buttonText: "Okay",
            textStyle: { color: globalStyles.thirdThemeColor },
            position: "bottom",
            // duration: 10000,
          });
        }
      } else {
        // simpleToast('Email is not correct');
        simpleToast({
          text: "Email is not correct!",
          buttonText: "Okay",
          textStyle: { color: globalStyles.thirdThemeColor },
          position: "bottom",
          // duration: 10000,
        });
      }
    }
  };

  getAddress = async () => {
    try {
      this.setState({ waitingLoaderVisible: true, isLoading: true });
      let userId = await AsyncStorage.getItem("userId");
      console.log("user id ", userId);
      let response = await UserApi.getAddress(userId);
      if (response.statusCode == 200) {
        this.setState({ waitingLoaderVisible: false, isLoading: false });
        simpleToast(response.message);
      }
      console.log("get address response$$$$$$$$$$$$$$$", response.addresses);
      this.setState({ AddressData: response.addresses });
      this.setState({ waitingLoaderVisible: false, isLoading: false });
    } catch (error) {
      console.log("error", error);
    }
  };

  signIn = async (username, password) => {
    console.log("inside siginIN", username, password)

    let data = {
      Username: username,
      Password: password,
    };
    try {
      let resp = await UserApi.authUserSignin(data);
      console.log("****", resp)
      if (resp && !resp.error) {
        await cleanStorage();
        await setItem(StorageKeys.Token, resp.token);
        await setItem(StorageKeys.UserId, resp.user.id.toString());
        await setItem(StorageKeys.PhoneNumberConfirmed, JSON.stringify(resp.user.phoneNumberConfirmed));
        this.setState({ isLoading: false, waitingLoaderVisible: false });
        let userData = {
          name: resp.user.userName,
          fullname: resp.user.fullName,
          phoneNumber: resp.user.phoneNumber,
        };
        console.log("response local storage data.....", userData);
        await setItemJson(StorageKeys.LoggedInUser, userData);
        await setItemJson(StorageKeys.User, userData);
        await this.getAddress();
        if ((this.state.AddressData !== null && this.state.AddressData !== undefined && this.state.AddressData.length > 0)) {
          this.props.navigation.navigate("Home");
        } else {
          this.props.navigation.navigate('PickLocation', { temp1: true })
        }

      } else {
        this.setState({ isLoading: false, waitingLoaderVisible: false });
      }
    } catch (error) {
      console.log(error);
    }
  };


  _changeIcon = () => {
    this.setState(prevState => ({
      icon: prevState.icon === "eye" ? "eye-off" : "eye",
      isPasswordDisable: !prevState.isPasswordDisable,
    }));
  };

  _foucus(value) {
    if (value == "email") {
      this.setState({
        typing_email: true,
        typing_password: false
      })
    }
    else {
      this.setState({
        typing_email: false,
        typing_password: true
      })
    }
  }

  _typing() {
    return (
      <TypingAnimation
        dotColor="#93278f"
        style={{ marginRight: 25 }}
      />
    )
  }

  _animation() {
    Animated.timing(
      this.state.animation_login,
      {
        toValue: 40,
        duration: 250
      }
    ).start();

    setTimeout(() => {
      this.setState({
        enable: false,
        typing_email: false,
        typing_password: false
      })
    }, 150);
  }


  render() {
    const width = this.state.animation_login;
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor='transparent' />
        <View style={styles.header}>
          <View
            style={styles.imageBackground}
          >
            <View style={{justifyContent:"center",alignItems:'center'}}>
            <Text style={{
              color: 'white',
              // fontWeight: 'bold',
              fontSize: 30
            }}>Welcome Back</Text>
            <Text style={{
              color: 'pink',
            }}>Sign in to continute</Text>
            </View>



            <View style={{ marginTop: 20 }}>
              <View style={styles.action}>
                <Feather
                  name="mail"
                  style={{ color: "#ffffff" }}
                  size={20}
                />
                <TextInput
                  placeholder="Your Email"
                  placeholderTextColor="#666666"
                  // secureTextEntry={data.secureTextEntry ? true : false}
                  style={[styles.textInput]}

                  onChangeText={(username) => this.setState({ username })}
                  getRef={(input) => { this.textInput = input; }}
                  value={this.state.username}
                  keyboardType={"email-address"}
                  autoCapitalize="none"
                  returnKeyType={"next"}
                  onSubmitEditing={(event) => this.password._root.focus()}
                  blurOnSubmit={false}
                  onFocus={() => this._foucus("email")}
                />
                {this.state.typing_email ?
                  this._typing()
                  : null}
              </View>

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
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                  autoCapitalize="none"
                  secureTextEntry={this.state.isPasswordDisable}
                  onFocus={() => this._foucus("password")}
                />
                {this.state.typing_password ?
                  this._typing()
                  : null}
              </View>
              <Text onPress={() => this.props.navigation.navigate("OTPverify")}
                style={{ textAlign: "center", marginTop: 10, color: "#ffffff" }}>Forgot Password?</Text>
              <Text style={[styles.textSign]} onPress={async () => await this.validate()}>SIGN IN</Text>

              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ flexDirection: "row", color: "#ffffff" }}>Not a user yet? </Text>
                <Text onPress={() => this.props.navigation.navigate("SignUp")}
                  style={{ flexDirection: "row", color: "#ef5777" }}>Sign up</Text>
              </View>
            </View>

          </View>
        </View>
      </View>
    );
  }
}

const width = Dimensions.get("screen").width;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  header: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "black",
    width: "100%",
    height: '100%'
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "#282828",
  // },
  textinput: {
    borderWidth: 1,
    borderColor: "#ef5777",
    borderRadius: 50,
    margin: 20,
    marginVertical: 10,
    paddingLeft: 20,
  },
  textSign: {
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ef5777",
    borderRadius: 50,
    margin: 20,
    marginTop: 30,
    marginVertical: 10,
    paddingLeft: 20,
    color: "white",
    backgroundColor: "#ef5777",
    padding: 15,
    textAlign: "center",
  },
  action: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 5,
    color: "#ffffff",
    fontSize: 13,
    flex: 1,
    alignItems: 'center',
    
  },
});
