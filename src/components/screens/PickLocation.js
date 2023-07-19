import React, { Component } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Button,
  BackHandler,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TouchableWithoutFeedbackComponent,
  TouchableOpacity,
  Platform
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { Container, Content, Item, Input, Label, Icon, Toast, Body } from "native-base";
import Geocoder from "react-native-geocoding";
import BaseURL from "../../services/BaseURL";
import AppTheme, { globalStyles } from "../styles/globalStyles";
import UserApi from "../../services/UserApi";
import Icons from "react-native-vector-icons/MaterialIcons";
import Location from "react-native-vector-icons/Entypo";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { add } from "tcomb-form-native/lib/i18n/en";
import * as Animatable from "react-native-animatable";
import { simpleToast } from "../../services/utility/toastMessage";

let currentCount = 0;
export default class PickLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      region: {},
      isMapReady: false,
      marginTop: 1,
      userLocation: "",
      routeName: props.route.params ? props.route.params.routeName : null,
      callback: props.route.params ? props.route.params.callback : null,
      regionChangeProgress: false,
      fullMap: true,
    };
  }

  disableBackButton = () => {
    if (this.props.route.params.temp1 == true) {
      if (currentCount < 1) {
        currentCount += 1;
        simpleToast("Press again to exit");
      } else {
        BackHandler.exitApp();
      }
      setTimeout(() => {
        currentCount = 0;
      }, 2000);
      return true;
    } else {
      this.props.navigation.goBack();
      return true;
    }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.disableBackButton);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.disableBackButton);
    Geolocation.getCurrentPosition(
      async (position) => {
        // console.log("success baby ", position);
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };
        this.setState({
          region: region,
          loading: false,
          error: null,
        });

        this.onRegionChange(region);
      },
      async (error) => {
        let region = {
          latitude: 26.9124,
          longitude: 75.7873,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };

        let rawRegion = await AsyncStorage.getItem("cachedDeviceLocation");
        if (rawRegion) {
          region = JSON.parse(rawRegion);
        }
        this.setState({
          error: error.message,
          loading: false,
          region: region,
        });
      },
      { timeout: 5000 },
    );

  }

  // Update state on region change
  onRegionChange = region => {
    this.setState({
      addressObtainedBySearching: "",
      region,
      regionChangeProgress: true,
    }, () => this.fetchAddress());
  };

  onMapReady = () => {
    this.setState({ isMapReady: true, marginTop: 0, addressObtainedBySearching: "" });
  };

  fetchAddress = async () => {
    if (this.state.region !== null && this.state.region !== undefined) {
      await AsyncStorage.setItem("cordinates", JSON.stringify(this.state.region));
    }

    Geocoder.init(BaseURL.GOOGLE_API_KEY); // use a valid API key
    Geocoder.from(this.state.region.latitude, this.state.region.longitude)
      .then(json => {
        let formattedAddress = {
          addressLine1: json.results[0].formatted_address,
          longitude: this.state.region.longitude,
          latitude: this.state.region.latitude,
        };

        // find out other properties
        let components = json.results[0].address_components;
        if (components && components.length > 3) {
          formattedAddress.postal_code = components[components.length - 1].long_name;
          formattedAddress.country = components[components.length - 2].long_name;
          formattedAddress.state = components[components.length - 3].long_name;
          formattedAddress.city = components[components.length - 4].long_name;
        }

        this.setState({ userLocation: formattedAddress, regionChangeProgress: false });
      })
      .catch(error => console.warn("Some error occured  = ", error));
    this.setState({ regionChangeProgress: false });
  };

  onLocationSelect = async () => {
    if (this.state.userLocation == "" || this.state.userLocation == null) {
      simpleToast("Please select an address");
      return;
    }

    let data = this.state.userLocation.addressLine1.split(",");
    let street = "";
    for (let i = 0; i < data.length - 3; i++) {
      street += data[i] + ",";
    }

    this.state.userLocation.street = street;

    this.props.navigation.navigate("AddAddress", {
      temp1: this.props.route.params.temp1,
      myLocation: this.state.userLocation,
      routeName: this.state.routeName,
      callback: this.state.callback,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
        <View style={{ flex: 3 }}>

          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "white",
            alignItems: "flex-start",
            paddingTop: wp(1),
          }}>
            {this.props.route.params.temp1 == false &&
            <Icons name="arrow-back" size={30} onPress={() => this.props.navigation.goBack()}
                   style={{ padding: 7, color: "grey", backgroundColor: "white" }} />
            }


            <GooglePlacesAutocomplete
              placeholder="Search here..."
              listViewDisplayed="auto"
              fetchDetails={true}
              returnKeyType={"default"}
              styles={{

                textInputContainer: {
                  borderColor: "grey",
                  borderWidth: 0.5,
                  borderRadius: 30,
                  width: "95%",
                  alignSelf: "center",
                },
                textInput: {
                  height: 28,
                  margin: wp(1.8),
                  color: "#5d5d5d",
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: "red",
                  height: 40,
                },
              }}
              onPress={(data, details = null) => {
                // "details" is provided when fetchDetails = true
                this.setState({ fullMap: true });
                var searchRegion = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                };
                this.setState({
                  region: searchRegion,
                  initialRegion: searchRegion,
                  regionChangeProgress: true,
                }, () => this.fetchAddress());
              }}
              textInputProps={{
                onChangeText: (text) => {
                  if (text.length > 0) {
                    this.setState({ fullMap: false });
                  } else {
                    this.setState({ fullMap: true });
                  }
                },
              }}
              query={{
                key: "AIzaSyArFM8-rSg6FKiYjVgeJX0zr0vneb7VzFQ",
                language: "en",
                components: "country:ind",
              }}
              onFail={(error) => simpleToast(error)}
              onNotFound={(error) => simpleToast(error)}
              onTimeout={(error) => simpleToast(error)}
            />
          </View>


          {!!this.state.region.latitude && !!this.state.region.longitude &&

          <MapView
            style={{ flex: this.state.fullMap == true ? 6 : 1 }}
            initialRegion={this.state.region}
            region={this.state.region}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation={true}
            onMapReady={this.onMapReady}
            onRegionChangeComplete={this.onRegionChange}
          >
            <MapView.Marker
              coordinate={{ "latitude": this.state.region.latitude, "longitude": this.state.region.longitude }}
              title={"Your Location"}
              // image ={require("../../assets/mymarker.png")}
              draggable
            />
          </MapView>
          }
        </View>
        <Animatable.View style={{
          flexDirection: "column",
          flex: 3,
          borderWidth: 2,
          borderColor: "pink",
          borderTopLeftRadius: 13,
          borderTopRightRadius: 10,
        }} animation="fadeInUp" delay={300}>
          <Text style={{
            fontSize: 16,
            color: "grey",
            fontFamily: Platform.OS === 'ios' ? "System" : "roboto",
            padding: 10,
            paddingTop: 20
          }}>SELECT DELIVERY LOCATION</Text>
          <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
            <Text style={{ fontSize: 15, color: "black", padding: 10 }}><Location name="location-pin" size={19}
                                                                                  style={{ color: "black" }} /> LOCATION</Text>
            {this.props.route.params.temp1 == false ?
              <TouchableOpacity style={{
                fontSize: 16,
                backgroundColor: "#fff",
                color: globalStyles.secondaryThemeColor,
                fontFamily: "roboto",
                marginBottom: 20,
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                marginRight: 10,
              }} onPress={() => this.props.navigation.navigate("Home")}><Text>Cancel</Text></TouchableOpacity>
              : null}
          </View>
          <Text numberOfLines={2} style={{
            fontSize: 16,
            paddingVertical: 10,
            color: "black",
            padding: 11,
          }}>
            {!this.state.regionChangeProgress ? this.state.userLocation.addressLine1 : "Identifying Location..."}</Text>

          <View style={styles.btnContainer}>
            <Button
              color={globalStyles.orangeThemeColor}
              title="CONFIRM LOCATION"
              disabled={this.state.regionChangeProgress}
              onPress={this.onLocationSelect}
            >
            </Button>
          </View>
        </Animatable.View>
      </View>
    );
  }
}


export const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    marginTop: Platform.OS === 'ios' ? wp(10) : wp(0)
  },
  map: {
    flex: 2,
  },
  mapMarkerContainer: {
    left: "47%",
    position: "absolute",
    top: "42%",
  },
  mapMarker: {
    fontSize: 40,
    color: "red",
  },
  deatilSection: {
    flex: 1,
    backgroundColor: globalStyles.secondaryThemeColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "column",
  },
  spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    width: Dimensions.get("window").width - 20,
    position: "absolute",
    backgroundColor: globalStyles.orangeThemeColor,
    bottom: 100,
    color: "white",
    left: 10,
  },
});

