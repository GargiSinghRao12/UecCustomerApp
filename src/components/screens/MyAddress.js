import React from "react";
import {
  BackHandler,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Modal,
  Text,
  Alert,
  Picker,
  SafeAreaView,
  TextInput,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import UserApi from "../../services/UserApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlusIcon from "react-native-vector-icons/Entypo"; // plus
import EditIcon from "react-native-vector-icons/Feather"; // edit-2
import DeleteIcon from "react-native-vector-icons/AntDesign"; // delete
import AppTheme, { globalStyles } from "../styles/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { simpleToast } from "../../services/utility/toastMessage";
import { setDefaultAddress } from "../../services/business/address";


export default class MyAddress extends React.Component {

  constructor(props) {
    super(props);
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
    this.state = {
      AddressData: [],
      value: null,
      waitingLoaderVisible: false,
      isLoading: false,
      routeName: props.route.params ? props.route.params.routeName : null,
      callBack: props.route.params ? props.route.params.callBack : null,
    };
  }

  navigateToback = () => {
    this.props.navigation.goBack();
  };

  rightOption = () => {
    alert("option press");
  };

  onBackButtonPressed() {
    this.props.navigation.goBack();
    return true;
  }

  componentDidMount = async () => {
    this.getAddress();
  };

  getAddress = async () => {
    try {
      this.setState({ waitingLoaderVisible: true, isLoading: true });
      let userId = await AsyncStorage.getItem("userId");
      let response = await UserApi.getAddress(userId);
      if (response.statusCode == 200) {
        this.setState({ waitingLoaderVisible: false, isLoading: false });
        simpleToast(response.message);
      }
      await setDefaultAddress(response.addresses[(response.addresses.length) - 1]);
      this.setState({ AddressData: response.addresses });
      this.setState({ waitingLoaderVisible: false, isLoading: false });
    } catch (error) {
      console.log("error", error);
    }
  };

  delete = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this address ?",
      [
        {
          text: "Cancel", onPress: () => {
            console.log('Cancel Pressed!');
          },
        },
        {
          text: "Confirm", onPress: async () => {
            await this.deleteAddress();
          },
        },
      ],
      { cancelable: false },
    );
  };

  deleteAddress = async (data) => {
    const { value } = this.state;
    if (value !== null) {
      try {
        let response = await UserApi.deleteSelectedAddress(value);
        if (response.statusCode == 200) {
          await this.getAddress();
          this.callagain();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      simpleToast("Please select an address");
    }
  };

  selectedAddressDelete = async (item) => {
    this.setState({ value: item.userAddressId });

  };
  callagain = async (item) => {
      this.props.navigation.goBack();
  };

  selectedAddress = async (item) => {
    this.setState({ value: item.userAddressId });

    await setDefaultAddress(item);
    if (this.state.callBack) {
      await this.state.callBack();
    }

    if (this.state.routeName) {
      this.props.navigation.navigate(this.state.routeName, { selectedAddress: item });
    } else {
      this.props.navigation.goBack();
    }
  };


  renderItem = (item) => {
    return (
      <View activeOpacity={0.9} style={{ height: 150 }}>
        <View style={styles.listItem}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => this.selectedAddress(item)} // we set our value state to key
            >
              {this.state.value === item.userAddressId && (<View style={styles.checkedCircle} />)}
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 20, flex: 5 }}>
            <Text style={{ fontWeight: "400", color: "white" }}>{item.contactName}</Text>
            <Text style={{ color: "white" }}>{item.phone}</Text>
            <Text style={{ color: "white" }}>{item.addressLine1}</Text>
            <Text style={{ color: "white" }}>{item.addressLine2}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", flex: 2 }}>

            {/* {this.state.AddressData.length>1? */}

            <TouchableOpacity onPress={() => {
              this.selectedAddressDelete(item);
              this.delete();
            }}>
              <DeleteIcon name={"delete"} color={globalStyles.orangeThemeColor} size={20} />
            </TouchableOpacity>
            {/* :null
                        } */}

          </View>
        </View>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#C9C9C9",
        }}
      />
    );
  };

  render() {
    const { AddressData, routeName, callback } = this.state;

    return (
      <SafeAreaView style={styles.container}>

        <View style={{ height: wp(15), backgroundColor: globalStyles.primaryThemeColor }}>
          <View style={{
            flex: 1,
            flexDirection: "row",
            padding: wp(3),
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}><Ionicons name={"arrow-back-outline"}
                                                                                         color="white"
                                                                                         size={wp(6)} /></TouchableOpacity>
              <Text style={{ color: "white", fontSize: wp(5) }}> My Address</Text>
            </View>
          </View>
        </View>


        <TouchableOpacity style={{
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: globalStyles.orangeThemeColor,
          padding: wp(2),
          margin: wp(2),
        }} activeOpacity={0.9} onPress={() => this.props.navigation.navigate("PickLocation", {
          temp1: false,
          routeName: routeName,
          callback: callback,
        })}>
          <PlusIcon name={"plus"} color={"white"} size={15} />
          <Text style={{ fontSize: 15, color: "white" }}>Add New</Text>
        </TouchableOpacity>
        {(AddressData !== null && AddressData !== undefined && AddressData.length > 0) ? <View style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={AddressData}
              renderItem={({ item, index }) => this.renderItem(item, index)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.renderSeparator}
              extraData={this.state}
            />
          </View>
          :
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ color: globalStyles.orangeThemeColor, fontSize: 24, textAlign: "center" }}>Loading...</Text>
          </View>
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
  listItem: {
    flexDirection: "row",
    backgroundColor: globalStyles.secondaryThemeColor,
    width: "100%",
    flex: 1,
    elevation: 1,
    padding: 10,
  },
  circle: {
    // flex: 1,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ACACAC",
  },
  checkedCircle: {
    margin: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: globalStyles.orangeThemeColor,
  },
});