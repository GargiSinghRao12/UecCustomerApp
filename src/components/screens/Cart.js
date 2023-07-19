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
} from "react-native";
import Swiper from "react-native-swiper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Rating, AirbnbRating } from "react-native-ratings";
import Geolocation from "@react-native-community/geolocation";
import BaseURL from "../../services/BaseURL";
import ServiceURL from "../../services/ServiceURL";
import RequestMethod from "../../services/RequestMethod";
import Geocoder from "react-native-geocoding";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { globalStyles } from "../styles/globalStyles";
import { clearCart, getCartItems, getTotalCartItemCount, increaseProductIntoCart } from "../../services/business/cart";
import UserApi from "../../services/UserApi";
import { simpleToast } from "../../services/utility/toastMessage";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Loader from "../containers/loader";


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {},
      cartCounter: 0,
      appState: AppState.currentState,
    };

    this.unsubscribe = null;
  }

  // define a separate function to get triggered on focus
  onFocusFunction = async () => {
    this.setCartLoading(true);
    await this.setCart();
    this.forceUpdate();
    this.setCartLoading(false);
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

  componentWillUnmount() {
    // BackHandler.removeEventListener("hardwareBackPress", this.disableBackButton);
    try {
      if (this.unsubscribe && this.unsubscribe.remove) {
        this.unsubscribe.remove();
      }
      AppState.removeEventListener("change", this._handleAppStateChange);
    } finally {

    }
  }

  componentDidMount = async () => {
    try {
      this.unsubscribe = this.props.navigation.addListener("tabPress", async e => {
        // Prevent default action
        await this.refreshData();
      });
      this.focusListener = this.props.navigation.addListener('focus', async e => {
        await this.refreshData();
      });
      AppState.addEventListener("change", this._handleAppStateChange);
      await UserApi.unlockCart();
      this.setCartLoading(true);
      this.unsubscribe = this.props.navigation.addListener("tabPress", async e => {
        // Prevent default action
        await this.onFocusFunction();
      });
      await this.onFocusFunction();
    } finally {
      this.setCartLoading(false);
    }
  };

  setCart = async () => {
    let cartData = await getCartItems();
    let count = await getTotalCartItemCount(cartData);
    if (cartData != null) {
      this.setState({
        cart: cartData,
        cartCounter: count,
      });
    }
  };

  setCartLoading = (isLoading) => {
    this.setState({
      isLoading: isLoading,
    });
  };

  emptyCart = async () => {
    try {
      await clearCart(this.cb);
    } catch (ex) {
      console.log("error in cleaning cart ", ex);
    } finally {
    }
  };

  increaseCartItemCount = async (item) => {
    try {
      this.setCartLoading(true);
      if (!item.productStockTrackingIsEnabled || item.productStockQuantity > 0) {
        let body = {
          "cartItemId": item.id,
          "quantity": item.quantity + 1,
        };
        let response = await UserApi.updateProductToCart(body);
        if (response) {

        }
      } else {
        simpleToast("You can not add more");
      }
    } catch (ex) {
      simpleToast("Unable to add product in cart");
    } finally {
      await this.setCart();
      this.setCartLoading(false);
    }
  };

  cb = () => {
    this.props.navigation.navigate("Home");
  };

  decreaseCartItemCount = async (item) => {
    try {
      this.setCartLoading(true);
      let body = {
        "cartItemId": item.id,
        "quantity": item.quantity - 1,
      };
      if (body.quantity === 0) {
        try {
          let response = await UserApi.removeProductFromCart(body.cartItemId);
          if (response) {
            simpleToast("product removed from cart");
          }
        } catch (error) {
          simpleToast("Unable to removed product from cart");
          console.log(error);
        }

      } else {
        let response = await UserApi.updateProductToCart(body);
        if (response == null) {
          simpleToast("unable to change cart item");
        }
      }
    } finally {
      await this.setCart();
      this.setCartLoading(false);
    }
  };

  proceedToCheckout = () => {
    if (this.state.cartCounter > 0) {
      this.props.navigation.navigate("Order Details");
    } else {
      this.props.navigation.navigate("Home");
    }
  };

  checkoutBottomText = () => {
    if (this.state.cartCounter == 0) {
      return "Start exploring";
    } else {
      return "Proceed to checkout";
    }
  };

  renderCartItem = (item) => {
    return (
      <View
        style={{ flexDirection: "row", marginHorizontal: wp(1.5), backgroundColor: globalStyles.secondaryThemeColor }}>
        <View style={{ flex: 1.5, justifyContent: "center", alignItems: "center", height: hp(15) }}>
          <Image source={{ uri: item.productImage }} style={{ height: hp(13), width: wp(25) }} />
        </View>
        <View style={{ flex: 2, padding: wp(1.5) }}>
          <Text style={{ fontSize: wp(3.5), color: "white" }}>{item.productName}</Text>
          <Text style={{ fontSize: wp(3), color: "white" }}> {item.productPriceString}</Text>
          {/*<Text style={{ fontSize: wp(2.5), color: "gray" }}>{item.short}</Text>*/}
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity style={{ paddingBottom: wp(2) }}
                            onPress={async () => await this.increaseCartItemCount(item)}>
            <AntDesign name={"pluscircle"} color="white" size={wp(5)} /></TouchableOpacity>
          <Text style={{ fontSize: wp(3),  color: "white" }}>{item.quantity}</Text>
          <TouchableOpacity style={{ paddingTop: wp(2) }} onPress={async () => await this.decreaseCartItemCount(item)}>
            <AntDesign name={"minuscircle"} color="white" size={wp(5)} /></TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: wp(1.8),
          backgroundColor: globalStyles.primaryThemeColor,
        }}
      />
    );
  };

  render() {
    const { cart, cartCounter, isLoading } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.primaryThemeColor }}>
        <View style={{ height: wp(20), backgroundColor: globalStyles.secondaryThemeColor }}>
          <View style={{ flex: 1, flexDirection: "row", padding: wp(3) }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name={"arrow-back-outline"}
                        color="white"
                        size={wp(6)} /></TouchableOpacity>
            <Text style={{ color: "white", fontSize: wp(5) }}> Cart Items</Text>
          </View>
          <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: wp(10),
          }}>
            <Text style={{ color: "white" }}>Total Items : {cartCounter}</Text>
            <TouchableOpacity onPress={async () => await this.emptyCart()}>
              <MaterialIcons name={"delete"} color="gray" size={wp(6)} /></TouchableOpacity>
          </View>
        </View>
        {/* <View style={{ height: hp("72%") }}> */}
        {this.state.cartCounter > 0 && <FlatList
          style={{ paddingTop: wp(2), marginBottom: wp(12) }}
          data={cart.items}
          renderItem={({ item, index }) => this.renderCartItem(item, index)}
          ItemSeparatorComponent={this.renderSeparator}
          // pagingEnabled={true}

        />}

        {this.state.cartCounter == 0 &&
        <View style={{ alignContent: "center", alignItems: "center", paddingTop: wp(40), justifyContent: "center" }}>
          <Feather name={"shopping-cart"} color="gray" size={wp(30)} />
        </View>}
        {/* </View> */}
        <View style={{
          flexDirection: "row",
          height: hp(7),
          width: "100%",
          position: "absolute",
          bottom: 0,
          backgroundColor: globalStyles.secondaryThemeColor,
        }}>
          <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: wp(4), color: "white" }}>Total Price </Text>
            <Text style={{
              fontSize: wp(3.5),
              color: "white",
            }}>  {cart && cart.orderTotalString ? cart.orderTotalString : "₹ 0"}</Text>
          </View>

          <View style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: globalStyles.orangeThemeColor,
          }}>
            <Text style={{ fontSize: wp(3), textAlign: "center", color: "white" }}
                  onPress={() => this.proceedToCheckout()}>{this.checkoutBottomText()} </Text>
            {/* <Ionicons name={'cart-outline'} color="white" size={wp(4)} /> */}
          </View>
        </View>
        {
          isLoading &&
          <Loader visible={isLoading} isLoading={isLoading} />
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  logoStyle: {
    height: wp("35%"),
    width: wp("97%"),
    alignSelf: "center",
    borderRadius: 3,
    // elevation: 10
  },
});
