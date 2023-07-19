import React from "react";
import {
  BackHandler,
  StyleSheet,
  View,
  Dimensions,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Modal,
  Text,
  Alert,
  Picker,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import UserApi from "../../services/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Container, Content, Item, Input, Label, Icon, Toast, Body } from "native-base";
import Geocoder from "react-native-geocoding";
import Geolocation from "@react-native-community/geolocation";
import BaseURL from "../../services/BaseURL";
import AppTheme, { globalStyles } from "../styles/globalStyles";
import Tcomb from "tcomb-form-native";
import { cloneDeep } from "lodash";
import Ionicons from "react-native-vector-icons/Ionicons";
import { simpleToast } from "../../services/utility/toastMessage";
import Loader from "../containers/loader";
import { makeLastDefaultAddress } from "../../services/business/address";
import RNPickerSelect from 'react-native-picker-select';
import { setDefaultAddress } from "../../services/business/address";


const Form = Tcomb.form.Form;
const customStyle = cloneDeep(Tcomb.form.Form.stylesheet);
const customInputStyle = cloneDeep(Tcomb.form.Form.stylesheet);


export default class AddAddress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: "",
        number: "",
        houseNo: "",
        street: "",
        locality: "",
        city: this.props.route.params.myLocation.city,
        pincode: "",
        stateName: this.props.route.params.myLocation.state,
        addressType: "",
      },
      routeName: props.route.params ? props.route.params.routeName : null,
      callback: props.route.params ? props.route.params.callback : null,
      isLoading: false,
      waitingLoaderVisible: false,
      loading: true,
      districtData: [],
      countryId: "IN",
      StateData: [],
      districtId: null,
      stateId: null,
      region: {
        latitude: 10,
        longitude: 10,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      },
    };
    this.initFormValues();
  }


  onChange = (value) => {
    this.setState({ value });
  };


  _getCustomStyle = () => {
    // Customize Form Stylesheet
    customStyle.textbox.normal = {
      ...customStyle.textbox.normal,
      height: 150,
      color: "gray",
    };
    customStyle.controlLabel.normal = {
      ...customStyle.controlLabel.normal,
      fontSize: 15,
      color: "gray",
    };

    return customStyle;
  };


  _getCustomInputStyle = () => {
    customInputStyle.controlLabel.normal = {
      ...customInputStyle.controlLabel.normal,
      fontSize: 15,
      color: "white",
    };
    customInputStyle.textbox.normal = {
      ...customInputStyle.textbox.normal,
      color: "white",
      borderColor: "transparent",
      borderBottomColor: "gray",
      borderBottomWidth: 1,

    };
    customInputStyle.textbox.error = {
      ...customInputStyle.textbox.normal,
      color: "white",
      borderColor: "transparent",
      borderBottomColor: "gray",
      borderBottomWidth: 1,
    };
    customInputStyle.formGroup.normal = {
      ...customInputStyle.formGroup.normal,
      justifyContent: "space-between",
      backgroundColor: globalStyles.secondaryThemeColor,
      marginTop: 10,
      paddingHorizontal: 5,
      marginHorizontal: 10,
      borderRadious: 10,
    };
    customInputStyle.formGroup.error = {
      ...customInputStyle.formGroup.normal,
      justifyContent: "space-between",
      backgroundColor: globalStyles.secondaryThemeColor,
      marginTop: 10,
      paddingHorizontal: 5,
      marginHorizontal: 15,
      borderRadious: 10,
    };
    customInputStyle.errorBlock = {
      ...customInputStyle.errorBlock,

    };
    return customInputStyle;
  };


  initFormValues = () => {

    // define customer form
    this.Customer = Tcomb.struct({
      name: Tcomb.String,
      number: Tcomb.String,
      houseNo: Tcomb.String,
      locality: Tcomb.String,
      city: Tcomb.String,
      pincode: Tcomb.String,
      stateName: Tcomb.String,

    });

    // form options
    this.options = {
      // auto:"none", // we have labels and placeholders as option here (in Engrish, ofcourse).
      // stylesheet: css,
      auto: "placeholders",
      fields: {
        name: {
          placeholder: "Home, Office etc",
          error: "Enter Name", // for simple empty error warning.
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: "gray",
          maxLength: 8,
        },
        number: {
          error: "Enter Phone Number",
          placeholder: "Phone Number ",
          maxLength: 10,
          minLength: 10,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: "gray",
        },

        houseNo: {
          placeholder: "House/officeNo./Street Address",
          error: "Enter House/officeNo./Street Address",
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: "gray",
        },

        locality: {
          placeholder: "locality address",
          error: "Enter locality address",
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: "gray",
        },

        city: {
          placeholder: "City Name",
          error: "Enter City",
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: "gray",
        },

        pincode: {
          placeholder: "Pincode",
          error: "Enter Pincode",
          minLength: 6,
          maxLength: 6,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: "gray",
        },

        stateName: {
          placeholder: "State",
          error: "Enter State ",
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: "gray",
        },
      },
    };
  };

  selectedDistrict = label => {
    const { name, number, houseNo, street, locality, city, stateName, pincode } = this.state.value;
    if (label !== 0) {
      this.setState({ city: label });
    }
  };

  selectedState = label => {
    const { name, number, houseNo, street, locality, city, stateName, pincode } = this.state.value;
    if (label !== 0) {
      this.setState({ stateName: label });
    }
  };


  componentDidMount = async () => {
    const routeParams = this.props.route.params;
    const previousAddress = {
      name: "",
      number: "",
      houseNo: "",
      street: "",
      locality: routeParams.myLocation.street,
      city: routeParams.myLocation.city,
      pincode: routeParams.myLocation.postal_code,
      stateName: routeParams.myLocation.state,
      addressType: "",
      countryName: routeParams.myLocation.country,
    };

    this.setState({ value: previousAddress });

    console.log("previous address infomation ", previousAddress);

    const region = {
      latitude: routeParams.myLocation.latitude,
      longitude: routeParams.myLocation.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    this.setState({
      region: region,
      loading: false,
      error: null,
    });
    await this.getState();
    await this.getDistrict();
  };


  getState = async () => {
    try {
      let response = await UserApi.getState();
      console.log("state data ", response);
      if (response && response.statesOrProvinces && response.statesOrProvinces.length > 0) {
        this.setState({ StateData: response.statesOrProvinces })

        //check if we have selected state
        let selectedState = response.statesOrProvinces.find((x=>x.name.toLowerCase() == this.state.value.stateName.toLowerCase()));
        console.log("found selected state ", selectedState);
        if(selectedState){
          //great we got state selected
          this.setState({
            selectedStateId: selectedState.id
          })
        }
      }else{
        console.log("no data found");
      }
    } catch (error) {
      console.log("error in getting state ", error);
    }
  }

  getDistrict = async () => {
    try {
      let response = await UserApi.getDistrict(this.state.selectedStateId);
      if (response && response.length > 0) {
        this.setState({ districtData: response })

        //check if district is selected
        let selectedDistrict = response.find(x=> x.name.toLowerCase() == this.state.value.city.toLowerCase());
        console.log("found selected city", selectedDistrict);
        if(selectedDistrict){
          this.setState({
            selectedDistrictId: selectedDistrict.id
          })
        }
      }
    } catch (error) {
    }
  }

  handleSubmit = async () => {
    var value = this.refs.form.getValue();

    if (value) {
      await this.onSaveButtonPress();
    } else {
    }
  };

  onSaveButtonPress = async () => {
    const { name, number, houseNo, street, locality, city, stateName, pincode } = this.state.value;
    const { region, selectedDistrictId, selectedStateId } = this.state;
    let latitude = region.latitude;
    let longitude = region.longitude;

    //TODO: get actual city, state and country
    let body = {
      "contactName": name,
      "phone": number,
      "addressLine1": houseNo + ", " + locality,
      "addressLine2": city + ", " + stateName + ", " + "India",
      "districtId": selectedDistrictId ? selectedDistrictId :  19,
      "zipCode": pincode,
      "stateOrProvinceId": selectedStateId ? selectedStateId: 33,
      "city": city,
      "countryId": "IN",
      "DisplayDistrict": true,
      "DisplayZipCode": true,
      "DisplayCity": true,
      "Longitude": longitude,
      "Latitude": latitude,
      "shipableContries": [
        {
          "disabled": false,
          "group": null,
          "selected": false,
          "text": "",
          "value": "",
        },
        {
          "disabled": false,
          "group": null,
          "selected": false,
          "text": "",
          "value": "",
        },
      ],
    };

    console.log("body to be posted ", body);

    try {
      this.setLoader(true);
      let response = await UserApi.saveAddress(body);
      if (response.statusCode == 200) {
        simpleToast(response.message);
        if (this.state.callBack) {
          await this.state.callBack();
        }
        let address = await makeLastDefaultAddress();
        await setDefaultAddress(address);
        console.log("route name is "+ this.state.routeName);
        if (this.state.routeName) {
          this.props.navigation.navigate(this.state.routeName, { selectedAddress: address });
        } else {
          console.log("I am going to home ");
          this.props.navigation.navigate("Home");
        }
      }
    } catch (error) {
      simpleToast("Unable to save address");
    } finally {
      this.setLoader(false);
    }
  };

  setLoader = (value) => {
    this.setState({
      isLoading: value,
    });
  };

  render() {
    const { name, number, houseNo, street, locality, city, stateName, pincode } = this.state.value;
    const { districtData, StateData } = this.state;
    const isFirstAddress = this.props.route.params.temp1;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ height: wp(15), backgroundColor: globalStyles.primaryThemeColor }}>
          <View style={{
            flex: 1,
            flexDirection: "row",
            padding: wp(3),
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: globalStyles.PrimaryThemeColor,
          }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}><Ionicons name={"arrow-back-outline"}
                color="white"
                size={wp(6)} /></TouchableOpacity>
              <Text style={{ color: "white", fontSize: wp(5) }}> Add Address</Text>
            </View>

            {isFirstAddress == false ?
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                <View style={{
                  flex: 1,
                  flexDirection: "row",
                  padding: wp(2),
                  alignItems: "center",
                  backgroundColor: globalStyles.orangeThemeColor,
                  borderRadius: 5,
                }}>
                  <Text>Cancel</Text>
                </View>
              </TouchableOpacity>
              : null}

          </View>
        </View>
        <ScrollView>
          <Form
            ref="form"
            type={this.Customer}
            options={this.options}
            value={this.state.value}
            onChange={this.onChange}
          />
          {
            // this.state.value.stateName == "" &&
            // <RNPickerSelect
            //   placeholder={{
            //     label: 'Select a State...',
            //     value: null,
            //   }}
            //   onValueChange={this.selectedState}
            //   style={
            //     {
            //       inputIOS: { color: "#ffffff" },
            //       inputAndroid: { color: "#ffffff" },
            //       placeholderColor: "#ffffff",
            //     }
            //   }
            //   items={this.state.StateData.map(item => (
            //     {
            //       label: item.name,
            //       value: item.id,
            //       color: "rgba(77,38,22,1)"
            //     })
            //
            //   )}
            // />
          }

          {
            // this.state.value.city == "" &&
            // <RNPickerSelect
            //   placeholder={{
            //     label: 'Select a District...',
            //     value: null,
            //   }}
            //   onValueChange={this.selectedDistrict}
            //   style={
            //     {
            //       inputIOS: { color: "#ffffff" },
            //       inputAndroid: { color: "#ffffff" },
            //       placeholderColor: "#ffffff",
            //     }
            //   }
            //   items={this.state.districtData.map(item => (
            //     {
            //       label: item.name,
            //       value: item.id,
            //       color: "rgba(77,38,22,1)"
            //     }))}
            //
            // />
          }
          <TouchableOpacity style={styles.btnAdd} onPress={async () => this.handleSubmit()} activeOpacity={.9}>
            <Text style={{ color: "white", fontSize: 20 }}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
        {
          this.state.isLoading &&
          <Loader visible={this.state.isLoading} isLoading={this.state.isLoading} />
        }
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.secondaryThemeColor,
  },
  btnAdd: {
    height: 45,
    width: "90%",
    backgroundColor: globalStyles.orangeThemeColor,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 20,

  },

  btnAdd1: {
    height: 45,
    width: "50%",
    backgroundColor: globalStyles.orangeThemeColor,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 20,

  },
});




