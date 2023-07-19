import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  AppState,
  TouchableOpacity,
  Dimensions,
  Animated,
  BackHandler,
  Switch,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { globalStyles } from "../styles/globalStyles";
import Icons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Star from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Info from "react-native-vector-icons/MaterialCommunityIcons";
import BaseURL from "../../services/BaseURL";
import UserApi from "../../services/UserApi";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import Loader from "../containers/loader";
import * as Animatable from "react-native-animatable";
import Cart from "react-native-vector-icons/Zocial";
import Rupee from "react-native-vector-icons/FontAwesome";
import RBSheet from "react-native-raw-bottom-sheet";
import Slider from "react-native-fluid-slider";
import AppConfig from "../../components/constants/AppConfig";
import Ionicons from "react-native-vector-icons/Ionicons";
import { clearCart, getCartItems, getTotalCartItemCount, increaseProductIntoCart } from "../../services/business/cart";

export default class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: "fadeInUpBig",
      // vendorId: props.route.params ? props.route.params.storeId : 0,
      liveLocation: "",
      Value: [],
      AddressData: [],
      isLoading: false,
      cart: {},
      cartCounter: 0,
      // StoreId: this.props.route.params.Item.id,
      StoreId: this.props.route.params.Item.id,
      ItemDetail: this.props.route.params.Item,
      // categoryList: this.props.navigation.state.params.categoryList,
    };
    this.unsubscribe = null;
    this.focusListener = null;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.disableBackButton);
  }

  disableBackButton = () => {

    this.props.navigation.goBack();
    return true;
  };

  refreshData = async () => {
    try {
      let cartData = await getCartItems();
    let count = await getTotalCartItemCount(cartData);
      this.setState({
        cart: cartData,
        cartCounter: count,
      });
    } catch (ex) {
    } finally {
    }
  }; 

  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      await this.refreshData();
    }
    this.setState({ appState: nextAppState });
  };


  componentDidMount = async () => {
    this.unsubscribe = this.props.navigation.addListener("tabPress", async e => {
      // Prevent default action
      await this.refreshData();
    });
    this.focusListener = this.props.navigation.addListener('focus', async e => {
      await this.refreshData();
    });
    AppState.addEventListener("change", this._handleAppStateChange);
    const { StoreId, ItemDetail } = this.state
    this.setState({ ItemDetail: this.props.route.params.Item })
    // this.state.StoreId= ItemDetail.id,
    this.setState({ StoreId: ItemDetail.id })
    console.log("StoreId", StoreId);
    await this.vendorProduct();
    await this.setCart();
  };


  setCart = async () => {
    console.log("Hello I am in setCart.......");
    let cartData = await getCartItems();
    let count = await getTotalCartItemCount(cartData);
    if (cartData != null) {
      this.setState({
        cart: cartData,
        cartCounter: count,
      });
    }
  };

  vendorProduct = async () => {

    try {
      // this.setState({ waitingLoaderVisible: true, isLoading: true })
      let response = await UserApi.getVendorProduct(this.state.StoreId, this.props)
      console.log("vendor product response = ", response)
      this.setState({ Value: response })
      console.log("vendor product response = ", Value)
    }
    catch (error) {

    }
  };

  render() {
    const { Value, ItemDetail, cart, cartCounter, } = this.state
    return (
      <>
        <View style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: globalStyles.primaryThemeColor,
          justifyContent: "space-between",
        }}>
          <View key={"nokey"} style={{
            flexDirection: "row",
            height: wp(13),
            padding: 10,
            backgroundColor: globalStyles.secondaryThemeColor,
            justifyContent: "space-between",
          }}>
            <View style={{ flex: 0.3, alignItems: "center", flexDirection: "row" }}>
              <Icons name="arrow-back" size={30} onPress={() => this.props.navigation.goBack()}
                style={{ color: globalStyles.orangeThemeColor }} />
              {/* <Text style={{ color: (globalStyles.orangeThemeColor), fontSize: 25 ,marginLeft:wp(2) }}>{this.props.route.params.name}</Text> */}
            </View>

            <View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
              <Animatable.View animation={"zoomInDown"} duration={800}>
                <View style={{
                  flexDirection: "row",
                  height: hp(7),
                  marginBottom: wp(1),
                  width: wp("50%"),
                  alignItems: "center",
                  backgroundColor: globalStyles.primaryThemeColor,
                  borderRadius: 15,
                  alignSelf: "center",
                }}>
                  <Ionicons name={"search-outline"} style={{ paddingLeft: wp(2), flexDirection: "row" }} size={wp(4.4)} color={"white"} />
                  <TextInput
                    placeholder="  Find what you love :)"
                    color={"white"}
                    placeholderTextColor="white"
                    // searchText={searchText}
                    // onChangeText={async (value) => await this.onSearchTextChange(value)}
                    style={{ flexDirection: "row" }}
                  />
                </View>
              </Animatable.View>
              <Animatable.View animation={"zoomInDown"} duration={800} style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Cart")}>
                  <Feather name={"shopping-cart"} color={globalStyles.orangeThemeColor} size={wp(4.5)} />
                </TouchableOpacity>
                <Text style={{
                  flexDirection: "row",
                  color: globalStyles.orangeThemeColor,
                }}>{" " + this.state.cartCounter} </Text>
              </Animatable.View>
            </View>
          </View>
          <ScrollView style={{ flexDirection: "column" }}>
            <Animatable.View animation={this.state.animation} duration={800} style={{
              height: wp(50),
              backgroundColor: globalStyles.secondaryThemeColor,
              alignItems: "center",
              flexDirection: "column",
            }}>
              <View style={{
                height: wp(20),
                width: "95%",
                backgroundColor: globalStyles.secondaryThemeColor,
                marginVertical: wp(3),
              }}>
                <Text style={{
                  color: "#fff",
                  fontSize: wp(5),
                  fontWeight: "900",
                  marginVertical: wp(1),
                }}>{ItemDetail.name}</Text>
                <Text style={{ color: "grey", fontSize: wp(4) }}>{ItemDetail.description}</Text>
                <Text style={{ color: "grey", fontSize: wp(4) }}>Distance: {ItemDetail.distance} kms</Text>
              </View>
              <View style={{
                height: wp(20),
                width: "95%",
                marginVertical: wp(1),
                flexDirection: "row",
                borderColor: "grey",
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderBottomWidth: 1,
              }}>
                <View style={{
                  flex: 0.33,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: globalStyles.secondaryThemeColor,
                }}>
                  <Text style={{ color: "#fff", fontSize: wp(3.5), marginHorizontal: wp(1.5) }}><Star name="star"
                    size={wp(4.5)}
                    style={{ color: globalStyles.orangeThemeColor }} /> {ItemDetail.vendorRating}</Text>
                  <Text style={{ color: "grey", fontSize: wp(3.5), marginHorizontal: wp(1.5) }}>Taste 75%</Text>
                </View>
                <View style={{
                  flex: 0.33,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: globalStyles.secondaryThemeColor,
                }}>
                  <Text style={{ color: "#fff", fontSize: wp(3.5), marginHorizontal: wp(1.5) }}>{ItemDetail.time} mins</Text>
                  <Text style={{ color: "grey", fontSize: wp(3.5), marginHorizontal: wp(1.5) }}>Delivery Time</Text>
                </View>
                <View style={{
                  flex: 0.33,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: globalStyles.secondaryThemeColor,
                }}>
                  <Text style={{ color: "#fff", fontSize: wp(3.5), marginHorizontal: wp(1.5) }}><Rupee name={"rupee"}
                    size={wp(4)}
                    color={globalStyles.orangeThemeColor} /> 200</Text>
                  <Text style={{ color: "grey", fontSize: wp(3.5), marginHorizontal: wp(1.5) }}>Taste 75%</Text>
                </View>
              </View>
            </Animatable.View>
            {/* <Animatable.View animation={this.state.animation} duration={1600} style={{
              height: wp("10"),
              backgroundColor: globalStyles.secondaryThemeColor,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}>
              <Switch
                style={{ marginHorizontal: 8 }}
              />
              <Text style={{ color: "grey", fontSize: 17 }}>VEG ONLY</Text>
            </Animatable.View> */}
            {
              this.state.Value.map((item, index) => (
                <Animatable.View animation={this.state.animation} duration={1600} style={{ flex: 1 }}>

                  <View style={{
                    height: wp("32"),
                    width: "100%",
                    backgroundColor: (globalStyles.secondaryThemeColor),
                    flexDirection: "column",
                    marginTop: 2,
                  }}>
                    <View style={{ height: "40%", width: "95%", alignSelf: "center", flexDirection: "row" }}>
                      <View style={{ flex: 0.7, flexDirection: "column", justifyContent: "center" }}>
                        <View style={{ flexDirection: "row", marginTop: wp("1") }}>
                          <Material name={"checkbox-intermediate"} size={10} color={"green"} />
                          <Text style={{ color: globalStyles.orangeThemeColor, fontSize: 10 }}>
                            <Material name={"star"}
                              size={10} color={globalStyles.orangeThemeColor} /> BESTSELLER</Text>
                        </View>
                        <Text style={{ color: "white", fontSize: 10 }}>{item.name}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                          <Rupee name={"rupee"} size={10} color={"grey"} />
                          <Text style={{ color: "grey", fontSize: 10 }}> {item.price}</Text>
                        </View>
                      </View>
                      <View style={{ flex: 0.3, flexDirection: "column", alignItems: "center" }}>
                        <Image source={{ uri: AppConfig.BASE_URL + item.thumbnailUrl }} style={{
                          position: "absolute",
                          height: wp("24"),
                          width: wp("24"),
                          margin: wp("2"),
                          borderRadius: 15,
                          alignSelf: "center",
                        }} />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Product Description", { productId: item.id })} style={{
                          position: "absolute",
                          alignItems: "center",
                          height: wp("6"),
                          width: wp("15"),
                          backgroundColor: "white",
                          borderRadius: wp("2"),
                          marginTop: wp("22"),
                          justifyContent: "center",
                          flexDirection: "row",
                        }}>
                          <Material name={"plus-thick"} size={15} color={"green"} />
                          <Text
                            style={{ color: "green", textAlign: "center", fontSize: 12,}}>ADD</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{
                      width: "35%",
                      height: "1%",
                      backgroundColor: "grey",
                      // alignSelf: "center",
                      marginTop: 18,
                    }} />
                    <View style={{ height: "25%", width: "95%", alignSelf: "center", flexDirection: "row" }}>
                      <View style={{ flex: 0.7, flexDirection: "column" }}>
                        <Text style={{ color: "white", fontSize: 10 }}>From {ItemDetail.name}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ color: "white", fontSize: 10 }}><Material name={"star"} size={10}
                            color={globalStyles.orangeThemeColor} /> 4.5
                            <Material name={"checkbox-blank-circle"} size={10}
                              color={globalStyles.orangeThemeColor} /> 39 mins </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                </Animatable.View>
              ))
            }
          </ScrollView>
          <Animatable.View animation={this.state.animation} duration={800}>
            <View style={{
              height: wp(13),
              backgroundColor: globalStyles.orangeThemeColor,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: globalStyles.secThemeColor,
            }}>
              <View style={{
                flex: 2, justifyContent: "center", alignItems: "center"
              }}>
                <Text style={{ color: "white", fontSize: wp(4.5) }}>{cartCounter} Item | {cart && cart.orderTotalString ? cart.orderTotalString : "0"}</Text>
              </View>
              <View style={{
                flex: 2,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: globalStyles.orangeThemeColor,
              }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Cart")}>
                  <Text style={{ color: "white", fontSize: wp(4.5), marginHorizontal: wp(2), flexDirection: "row" }}>VIEW CART</Text>
                  <Cart name={"cart"} size={wp(4.5)} color={"white"} style={{ marginLeft: 45 }} />
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </View>
      </>
      // <View>
      //   <Text>Hello World</Text>
      // </View>
    );
  }
}
const styles = StyleSheet.create({});
