import React, { Component } from "react";
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Image, ImageBackground, Animated, Dimensions,} from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonApi from "../../services/CommonApi";
import Feather from "react-native-vector-icons/Feather";
import { cleanStorage,getItem, setItem, setItemJson, StorageKeys } from "../../services/localstore/StorageService";
import { TypingAnimation } from 'react-native-typing-animation';
import * as Animatable from 'react-native-animatable';
import { simpleToast } from "../../services/utility/toastMessage";

export default class Login extends Component {

    constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      email: "",
      mobileNo: "",
      confirmPassword: "",

    };
  }

  doSignUP = async () => {
   
    const { userName, password, confirmPassword, email, mobileNo } = this.state;
    console.log("Value of all fields: ", userName, password, confirmPassword, email, mobileNo)
    if (userName != "" && email != "" && password != "" && confirmPassword != "" && mobileNo != "") {
      if (password == confirmPassword) {
        let data = {
          FullName: userName,
          Email: email,
          PhoneNumber: mobileNo,
          Password: password,
          ConfirmPassword: confirmPassword,
        };
        console.log("satisfied all conditionss   ",data)
        let guestUserEmail = await getItem(StorageKeys.GuestUserEmail);
        if (guestUserEmail != null) {
          data.GuestUserMail = guestUserEmail;
        }
        let response = await UserApi.authUserSignup(data, this.props);

        if (response.statusCode == 200) {
          await cleanStorage();
          await setItem(StorageKeys.Token, response.token);
          await setItemJson(StorageKeys.LoggedInUser, response.user);
          await setItemJson(StorageKeys.UserId, response.user.userId);
          await setItemJson(StorageKeys.User, response.user);
          simpleToast(response.message);
          this.props.navigation.navigate("Home");
        }
      } else {
        simpleToast("Password mismatch");
      }
    } else {
      simpleToast("Please enter all fields");
    }
  };

  render() {
    const { userName, password, confirmPassword, email, mobileNo } = this.state;
    const width = this.state.animation_login;
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor='transparent' />
        <View style={styles.header}>
          <ImageBackground
            source={require("../../assets/SignUp.png")}
            style={styles.imageBackground}
          // resizeMode="stretch" resizeMethod="resize"
          >
            <View style={{ marginTop: 200, alignItems: 'center', justifyContent: 'center', marginHorizontal: 48 }}>
              <View style={styles.action}>
                <Feather
                  name="user"
                  style={{ color: "#ffffff" }}
                  size={20}
                />
                <TextInput
                  placeholder="Your Name"
                  placeholderTextColor="#dfe6e9"
                  style={[styles.textInput]}
                  // getRef={(input) => { this.textInput = input; }}
                          // value={this.state.username}
                          keyboardType={"email-address"}
                          autoCapitalize="none"
                          returnKeyType={"next"}
                          onSubmitEditing={(event) => this.password._root.focus()}
                          // blurOnSubmit={false}
                          onChangeText={(userName) => this.setState({userName: userName })}
                />
              </View>
              <View style={styles.action}>
                <Feather
                  name="mail"
                  style={{ color: "#ffffff" }}
                  size={20}
                />
                <TextInput
                  placeholder="Your Email"
                  placeholderTextColor="#dfe6e9"
                  style={[styles.textInput]}
                  // getRef={(input) => { this.textInput = input; }}
                  // value={this.state.username}
                  keyboardType={"email-address"}
                  autoCapitalize="none"
                  returnKeyType={"next"}
                  // onSubmitEditing={(event) => this.password._root.focus()}
                  blurOnSubmit={false}
                  onChangeText={(email) => this.setState({ email })}
                />
              </View>

              <View style={styles.action}>
                <Feather
                  name="lock"
                  style={{ color: "#ffffff" }}
                  size={20}
                />
                <TextInput
                  placeholder="Your Password"
                  placeholderTextColor="#dfe6e9"
                  secureTextEntry={true}
                  style={[styles.textInput]}
                  // getRef={(c) => this.password = c}
                  // value={this.state.password}
                  autoCapitalize="none"
                  // returnKeyType={"done"}
                  onChangeText={(password) => this.setState({ password })}
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
                  placeholderTextColor="#dfe6e9"
                  secureTextEntry={true}
                  style={[styles.textInput]}
                  // getRef={(c) => this.password = c}
                  // value={this.state.password}
                  autoCapitalize="none"
                  returnKeyType={"done"}
                  onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                />
              </View>
              <View style={styles.action}>
                <Feather
                  name="phone"
                  style={{ color: "#ffffff" }}
                  size={20}
                />
                <TextInput
                  placeholder="Mobile Number"
                  placeholderTextColor="#dfe6e9"
                  // secureTextEntry={data.secureTextEntry ? true : false}
                  keyboardType={"phone-pad"}
                  style={[styles.textInput]}
                  autoCapitalize="none"
                  onChangeText={(mobileNo) => this.setState({ mobileNo })}
                />
              </View>
              <Text style={[styles.textSign]} onPress={() => this.doSignUP()}>SIGN UP</Text>

              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ flexDirection: "row", color: "#ffffff" }}>Want to eat delicious food ? </Text>
                <Text onPress={() => this.props.navigation.navigate("Login")}
                  style={{ flexDirection: "row", color: "#ef5777" }}>Sign In</Text>
              </View>
            </View>

          </ImageBackground>
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
    justifyContent: 'center',
  },
  header: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 5,
    color: "#ffffff",
    fontSize: 13
  },
});

