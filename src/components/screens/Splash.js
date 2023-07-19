import React, { Component } from "react";
import { Text, View, SafeAreaView, StyleSheet, StatusBar,Image} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppTheme, { globalStyles } from "../styles/globalStyles";
import { getItem, StorageKeys, setItem, getItemJson } from "../../services/localstore/StorageService";
import UserApi from "../../services/UserApi";
import CommonApi from "../../services/CommonApi";
import { getSystemSettings } from "../../services/business/systemSettings";
import { simpleToast } from "../../services/utility/toastMessage";
import Geolocation from "@react-native-community/geolocation";

export default class Spalsh extends Component {
  constructor(props) {
    super(props);

    this.state = {

      animation: "zoomInUp",
      AddressData:[],

      region: {},

    };
  }


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

  componentDidMount = async () => {
    await setTimeout(() => this.setState({ animation: "lightSpeedOut" }), 2000);
    let token = await getItem(StorageKeys.Token);
    let guestUser = await getItemJson(StorageKeys.GuestUser);
    console.log("guest user", guestUser);
    let user = await getItemJson(StorageKeys.User);

    setTimeout(async () => {
      if (token == null) {
        //creating guest user
        await UserApi.guestUserLogin();
        await getSystemSettings(true);
      }

      if(token==null){
        this.props.navigation.navigate("Home");
      }

      await this.getAddress();
      if ((this.state.AddressData !== null && this.state.AddressData !== undefined && this.state.AddressData.length > 0)) {
        this.props.navigation.navigate("Home");
      } else {
      this.props.navigation.navigate('PickLocation',{temp1:true})
      }

    }, 2000);

    Geolocation.getCurrentPosition(
      async (position) => {
        console.log("success baby ");
        // console.warn("Hii Gargi Here is the issue ..............",position);
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };
        // this.setState({
        //   region: region,
        //   loading: false,
        //   error: null,
        // });

        this.onRegionChange(region);
      },
      async (error) => {
        let region = {
          latitude: 26.9124,
          longitude: 75.7873,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };

        // let rawRegion = await AsyncStorage.getItem("cachedDeviceLocation");
        // if (rawRegion) {
        //   region = JSON.parse(rawRegion);
        // }
        // this.setState({
        //   error: error.message,
        //   loading: false,
        //   region: region,
        // });
      },
      { timeout: 5000 },
    );

  };

  render() {

    return (
      <View style={styles.container}>
      <StatusBar animated={true} backgroundColor={globalStyles.primaryThemeColor} />
        <Animatable.View style={styles.Center} animation={this.state.animation}>
          <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Image
                            style={{ height: wp(20), width: wp(35) }}
                            source={require("../../assets/foodicon.png")}
                        />
          </SafeAreaView>
        </Animatable.View>

      </View>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor:globalStyles.primaryThemeColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Center: {
    backgroundColor: globalStyles.primaryThemeColor,
    width: wp("50%"),
    height: wp("50%"),
  },


});



4