import ClockIcon from "react-native-vector-icons/EvilIcons";
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
  TouchableOpacity,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Rating, AirbnbRating } from "react-native-ratings";
import Ionicons from "react-native-vector-icons/Ionicons";
import { globalStyles as globalStyle, globalStyles } from "../styles/globalStyles";
import StepIndicator from "react-native-step-indicator";
import { RadioButton } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { getCartItems, getTotalCartItemCount } from "../../services/business/cart";
import UserApi from "../../services/UserApi";
import { applyCoupon } from "../../services/business/coupon";
import { simpleToast } from "../../services/utility/toastMessage";
import { getDefaultAddress } from "../../services/business/address";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import {
  applyEWalletDiscount,
  applyRWalletDiscount,
  getEWalletBalance,
  getRWalletBalance,
} from "../../services/business/wallet";
import { getTimeSlots } from "../../services/business/deliveryTime";
import { getTimeSlotPopup } from "../containers/timeslotModel";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  cashCollectedOnDelivery,
  checkout,
  orderNow,
  paymentDone,
  razorpayPayment,
} from "../../services/business/order";
import Loader from "../containers/loader";

const customStyles = {
  stepIndicatorSize: wp(6),
  currentStepIndicatorSize: wp(9),
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: globalStyles.orangeThemeColor,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: globalStyles.orangeThemeColor,
  stepStrokeUnFinishedColor: "gray",
  separatorFinishedColor: globalStyles.orangeThemeColor,
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: globalStyles.orangeThemeColor,
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: globalStyles.orangeThemeColor,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "white",
  stepIndicatorLabelFinishedColor: "white",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: globalStyles.orangeThemeColor,
};

export default class Checkout extends Component {
  constructor(props) {
    console.log("route properties ", props.route.params);
    super(props);
    this.state = {
      paymentMethod: undefined,
      walletApplied: null,
      currentPosition: 1,
      cart: {},
      couponCode: "",
      couponCodeApplied: false,
      cartCounter: 0,
      selectedAddress: props.route.params ? props.route.params.selectedAddress : null,
      eWalletBalance: 0,
      rWalletBalance: 0,
      chosenFromDeliverySlot: undefined,
      chosenToDeliverySlot: undefined,
      timeSlots: [],
      selectedTimeSlotId: null,
      timeModalVisible: false,
    };
  }

  applyCouponCode = async (code) => {
    try {
      code = code.trim();
      console.log("coupon code appplied is:" + code);
      if (code.length > 0) {
        let status = await applyCoupon(code);
        if (status) {
          simpleToast("Coupon code applied");
          await this.setCart();
          this.setState({
            couponCodeApplied: true,
          });
        } else {
          simpleToast("Enter a valid coupon code");
        }
      } else {
        simpleToast("Enter a valid coupon code");
      }
    } catch (ex) {
      simpleToast("Enter a valid coupon code");
    }
  };

  setCart = async () => {
    let cartData = await getCartItems();
    let count = await getTotalCartItemCount(cartData);
    if (cartData != null) {
      this.setState({
        cart: cartData,
        couponCode: cartData.couponCode,
        cartCounter: count,
      });
      let walletApplied = null;
      if (cartData.wallet && cartData.wallet == "R-Wallet") {
        walletApplied = "rwallet";
      } else if (cartData.wallet && cartData.wallet == "E-Wallet") {
        walletApplied = "wallet";
      }

      if (walletApplied) {
        this.setState({
          walletApplied: walletApplied,
        });
      }
    }
  };

  componentDidMount = async () => {
    try {
      await UserApi.unlockCart();
      this.setPageLoading(true);
      await this.setCart();
      if (this.state.selectedAddress == null || this.state.selectedAddress == undefined) {
        let address = await getDefaultAddress();
        this.setState({
          selectedAddress: address,
        });
      }

      //calculate delivery charges again
      if (this.state.selectedAddress) {
        await this.updateShippingPrice(this.state.selectedAddress);
      }

      let eWalletBalance = await getEWalletBalance();
      let rWalletBalance = await getRWalletBalance();

      this.state.razorpay = await UserApi.getRazorPayDetails();

      this.setState({
        eWalletBalance: eWalletBalance ? eWalletBalance : 0,
        rWalletBalance: rWalletBalance ? rWalletBalance : 0,
      });
    } finally {
      this.setPageLoading(false);
    }
  };

  selectTimeSlot = async (item) => {
    let date = moment().date();
    let incomingDate = moment(item.fromDeliverySlot && item.toDeliverySlot).date();

    if (date === incomingDate) {
      this.setState({ dateDay: "Today" });
    } else {
      this.setState({ dateDay: "Tomorrow" });
    }

    await this.setState({
      chosenFromDeliverySlot: moment(item.fromDeliverySlot).format("hh A"),
      chosenToDeliverySlot: moment(item.toDeliverySlot).format("hh A"),
    });
    this.setState({ timeModalVisible: false, selectedTimeSlotId: item.id });
  };

  updateShippingPrice = async (address) => {
    let data = {
      "SelectedShippingMethodName": "Free",
      "ExistingShippingAddressId": address.userAddressId,
    };
    let priceResponse = await UserApi.updateShippingPrices(data);

    console.log("updted price fresponse ", priceResponse);
    if (priceResponse) {
      await this.setCart();
    }
  };

  setPageLoading = (isLoading) => {
    this.setState({
      isLoading: isLoading,
    });
  };

  refreshChosenAddress = async () => {
    let address = await getDefaultAddress();
    this.setState({
      selectedAddress: address,
    });

    await this.updateShippingPrice(this.state.selectedAddress);
    await this.setCart();
  };

  selectAddress = async () => {
    this.props.navigation.navigate("MyAddress", { routeName: "Order Details", callBack: this.refreshChosenAddress });
  };

  navigateToScreen = (screenName) => {
    this.props.navigation.navigate(screenName);
  };

  applyWalletDiscount = async (value) => {
    this.setState({ walletApplied: value });
    console.log("wallet name ", value);
    if (value == "wallet") {
      await applyEWalletDiscount(this.state.cart);
    } else {
      await applyRWalletDiscount(this.state.cart);
    }

    await this.setCart();
  };

  setModalVisible(visible) {
    this.setState({ timeModalVisible: visible });
  }

  getTimeSlots = async () => {
    this.setState({ timeModalVisible: true });
    let response = await UserApi.getTimeSlots();
    console.log("time slots ", response);
    if (response && response.length > 0) {
      this.setState({ timeSlots: response });
    }
  };

  setLoading = (value) => {
    this.setState({
      isLoading: value,
    });
  };

  orderNow = async () => {
    try {
      let isSuccessCheckout = await checkout(this.state, this.navigateToScreen, this.setLoading);
      if (isSuccessCheckout) {

        if (this.state.paymentMethod == "online") {
          await razorpayPayment(this.state, this.navigateToScreen, this.setLoading);
        } else {
          await cashCollectedOnDelivery(this.navigateToScreen, this.setLoading);
        }
      }

    } catch (ex) {
      console.log("error in order now ", ex);
      paymentDone(false, this.navigateToScreen);
    } finally {
      this.setLoading(false);
    }
  };

  renderCartItems = (item) => {
    return (
      <View style={{
        height: hp(22),
        width: wp("60%"),
        backgroundColor: globalStyles.secondaryThemeColor,
        borderRadius: 8,
      }}>
        <View style={{ alignItems: "center", marginTop: wp("3%") }}>
          <Image source={{ uri: item.productImage }} style={{ height: hp(10), width: wp("55%"), borderRadius: 8 }} />
          <View style={{ height: hp(10), width: wp("55%") }}>
            <View style={{ flex: 1, alignItems: "flex-start", marginTop: wp(1) }}>
              <Text style={{ fontSize: wp(3), color: "white" }}>{item.productName} </Text>
              <Text style={{ fontSize: wp(3), color: "gray"}}>{item.productPriceString}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", borderRadius: 8 }}>
              <AirbnbRating
                count={5}
                showRating={false}
                reviews={["Terrible", "Bad", "Good", "Very Good", "Amazing"]}
                selectedColor="#f06755"
                defaultRating={4}
                size={wp(3.5)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };


  bottomSheetData = (item) => {
    console.log("item ===1 ", item);
    return (
      <View style={{
        height: hp(30),
        width: wp(35),
        backgroundColor: globalStyles.secondaryThemeColor,
        borderRadius: 4,
        borderColor: globalStyles.orangeThemeColor,
        borderWidth: 0.3,
      }}>
        <View style={{ alignItems: "center", marginTop: wp("3%") }}>
          <Image source={item.src} style={{ height: hp(15), width: wp("30%"), borderRadius: 8 }} />
          <View style={{ height: hp(10), width: wp("30%") }}>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginTop: wp(1) }}>
              <Text style={{ fontSize: wp(2), color: "white", }}>{item.name} </Text>
              <Text style={{ fontSize: wp(2), color: "gray"}}>₹ 102.4</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
              {/* <Text style={{ fontSize: wp(2), color: 'white', fontWeight: 'bold' }}>{item.name} </Text> */}
              <Text style={{ fontSize: wp(2), color: "gray"}}>Qty : 1</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", borderRadius: 8 }}>
              <AirbnbRating
                count={5}
                showRating={false}
                reviews={["Terrible", "Bad", "Good", "Very Good", "Amazing"]}
                selectedColor="#f06755"
                defaultRating={4}
                size={wp(2.5)}
              />

            </View>
          </View>
        </View>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          width: wp(1.8),
          backgroundColor: globalStyles.primaryThemeColor,
        }}
      />
    );
  };
  bottomSheetDataRenderSeparator = () => {
    return (
      <View
        style={{
          width: wp(1.8),
          backgroundColor: globalStyles.secondaryThemeColor,
        }}
      />
    );
  };

  render() {
    const {
      cart,
      couponCode,
      selectedAddress,
      dateDay,
      chosenFromDeliverySlot,
      chosenToDeliverySlot,
      timeSlots,
      selectedTimeSlotId,
      isLoading
    } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(1.6), backgroundColor: globalStyles.primaryThemeColor }}>
        <View style={{ paddingTop: wp(2) }}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={this.state.currentPosition}
            stepCount={4}
            direction="horizontal"
            labels={["Cart", "Order Details", "Payment", "Order Successful"]}
          />
        </View>

        <ScrollView>
          <View style={{ height: hp(22), marginTop: wp(2), backgroundColor: globalStyles.secondaryThemeColor }}>
            <FlatList
              style={{}}
              data={this.state.cart.items}
              renderItem={({ item, index }) => this.renderCartItems(item, index)}
              ItemSeparatorComponent={this.renderSeparator}
              // keyExtractor={(item, index) => `post__${index}`}
              showsHorizontalScrollIndicator={false}
              horizontal
              // pagingEnabled={true}

            />
          </View>
          <View style={{ marginTop: wp(2), height: hp(15), backgroundColor: globalStyles.secondaryThemeColor }}>
            <Text style={{ fontSize: wp(4), color: "gray", paddingLeft: wp(2), paddingTop: wp(2) }}>Have
              Promo Code ?</Text>
            <View style={{ flexDirection: "row", margin: wp(2) }}>
              <View style={{ flex: 1, borderColor: "gray", borderWidth: 1, borderRadius: 20 }}>
                <TextInput
                  placeholder="  Enter promo code"
                  placeholderTextColor="gray"
                  value={this.state.couponCode}
                  onChangeText={(couponCode) => this.setState({ couponCode })}
                  style={{ color: "white", fontSize: Platform.OS === 'ios'?  25: 15 }}
                />
              </View>
              <TouchableOpacity onPress={async () => await this.applyCouponCode(couponCode)} style={{
                flex: 0.4,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: globalStyles.orangeThemeColor,
                borderRadius: 20,
                marginHorizontal: wp(2),
              }}>
                <Text style={{ fontSize: wp(4),  color: "white" }}>
                  {this.state.couponCodeApplied ? "Applied" : "Apply"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: wp(2), height: hp(26), backgroundColor: globalStyles.secondaryThemeColor }}>
            <Text style={{ fontSize: wp(4), color: "gray", paddingLeft: wp(2), paddingTop: wp(2) }}>Order
              Details :</Text>
            <View style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: wp(2),
              paddingHorizontal: wp(5),
            }}>
              <Text style={{ fontSize: wp(3.4), color: "gray" }}>Total Items :</Text>
              <Text style={{ fontSize: wp(3.4), color: "gray" }}>5</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(5) }}>
              <Text style={{ fontSize: wp(3.4), color: "gray" }}>Sub Total :</Text>
              <Text style={{ fontSize: wp(3.4), color: "gray" }}>
                {cart.subTotalString ? cart.subTotalString : "₹ 0"}</Text>

            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(5) }}>
              <Text style={{ fontSize: wp(3.4), color: "gray" }}>Discount Applied :</Text>
              <Text style={{
                fontSize: wp(3.4),
                color: "gray",
              }}>  {cart.discountString ? cart.discountString : "₹ 0"} </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(5) }}>
              <Text style={{ fontSize: wp(3.4), color: "gray" }}>Wallet :</Text>
              <Text style={{
                fontSize: wp(3.4),
                color: "gray",
              }}>  {cart.walletDiscount ? "₹ " + cart.walletDiscount : "₹ 0"} </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(5) }}>
              <Text style={{ fontSize: wp(3.4), color: "gray" }}>Delivery Charges :</Text>
              <Text style={{
                fontSize: wp(3.4),
                color: "gray",
              }}>  {cart.discountString ? cart.shippingAmountString : "₹ 0"} </Text>
            </View>
            <View style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: wp(4),
              borderTopColor: "gray",
              borderWidth: 0.7,
            }}>
              <Text style={{ fontSize: wp(4.5), color: globalStyles.orangeThemeColor, }}>Total Amount
                :</Text>
              <Text style={{ fontSize: wp(4.5), color: globalStyles.orangeThemeColor,}}>
                {cart && cart.orderTotalString ? cart.orderTotalString : "₹ 0"}</Text>
            </View>
          </View>
          <View style={{ marginTop: wp(2), height: hp(22), backgroundColor: globalStyles.secondaryThemeColor }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: wp(2),
            }}>
              <Text style={{ fontSize: wp(4), color: "gray", paddingTop: wp(2) }}>Shipping Address
                :</Text>
              <TouchableOpacity onPress={async () => await this.selectAddress()}><Ionicons name={"pencil-outline"}
                                                                                           color="gray" size={wp(5)} /></TouchableOpacity>
            </View>
            <View style={{ padding: wp(5) }}>
              <Text style={{ fontSize: wp(3.2), color: "gray", paddingTop: wp(2) }}>
                {selectedAddress ? selectedAddress.contactName : ""}</Text>
              <Text style={{ fontSize: wp(3.2), color: "gray" }}>{selectedAddress ?
                selectedAddress.addressLine1 + " " + selectedAddress.addressLine2 + " "
                + selectedAddress.districtName + " "

                : ""} </Text>
              <Text style={{ fontSize: wp(3.2), color: "gray" }}>{selectedAddress ? selectedAddress.phone : ""}</Text>
            </View>
          </View>
          <View style={{ marginTop: wp(2), height: hp(22), backgroundColor: globalStyles.secondaryThemeColor }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: wp(2),
            }}>
              <Text style={{ fontSize: wp(4), color: "gray", paddingTop: wp(2) }}>Apply
                Wallet:</Text>
              <MaterialIcons name={"account-balance-wallet"} color="gray" size={wp(5)} />
            </View>
            <View style={{ paddingTop: wp(4) }}>
              <RadioButton.Group onValueChange={async (value) => await this.applyWalletDiscount(value)}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RadioButton
                    status={this.state.walletApplied == "wallet" ? "checked" : "unchecked"}
                    color={globalStyles.orangeThemeColor} value="wallet" />
                  <Text onPress={async () => await this.applyWalletDiscount("wallet")} style={{ fontSize: wp(3.2), color: "gray" }}>Your
                    Wallet {"( ₹ " + this.state.eWalletBalance + ")"}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RadioButton status={this.state.walletApplied == "rwallet" ? "checked" : "unchecked"}
                               color={globalStyles.orangeThemeColor} value="rwallet" />
                  <Text onPress={async () => await this.applyWalletDiscount("rwallet")} style={{ fontSize: wp(3.2), color: "gray" }}>Reward
                    wallet {"( ₹ " + this.state.rWalletBalance + ")"}</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          <View style={{ marginTop: wp(2), height: hp(18), backgroundColor: globalStyles.secondaryThemeColor }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: wp(2),
            }}>
              <Text style={{ fontSize: wp(4), color: "gray", paddingTop: wp(2) }}>
                Select Delivery :</Text>
              <MaterialIcons name={"delivery-dining"} color="gray" size={wp(5)} />
            </View>
            <View style={{ paddingTop: wp(4) }}>
              <View style={{
                flex: 1,
                paddingHorizontal: 10,
                paddingTop: wp(10),
                height: wp("15%"),
                alignItems: "center",
                justifyContent: "center",
              }}>
                <TouchableOpacity style={{
                  backgroundColor: globalStyles.orangeThemeColor,
                  flexDirection: "row",
                  paddingVertical: 5,
                  width: wp("85%"),
                  height: wp("10%"),
                  borderWidth: 2,
                  borderRadius: 100,
                  elevation: 2,
                  borderColor: globalStyle.primaryThemeColor,
                  shadowColor: "#000",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.5,
                  alignItems: "center",
                }} onPress={async () => await this.getTimeSlots()} activeOpacity={.9}>
                  <ClockIcon name={"clock"} color={globalStyle.primaryThemeColor} size={25}
                             style={{ paddingLeft: 10, paddingRight: 10 }} />
                  {(selectedTimeSlotId && selectedTimeSlotId !== null && selectedTimeSlotId !== undefined) ? <Text
                      style={{
                        color: "black",
                        fontSize: 12,
                      }}>{dateDay + " " + chosenFromDeliverySlot + "  -  " + chosenToDeliverySlot}</Text>
                    :
                    <Text style={{ color: globalStyle.primaryThemeColor, fontWeight: "400" }}>Select Time</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ marginTop: wp(2), height: hp(22), backgroundColor: globalStyles.secondaryThemeColor }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: wp(2),
            }}>
              <Text style={{ fontSize: wp(4), color: "gray", paddingTop: wp(2) }}>Select Payment Method
                :</Text>
              <MaterialIcons name={"payments"} color="gray" size={wp(5)} />
            </View>
            <View style={{ paddingTop: wp(4) }}>
              <RadioButton.Group onValueChange={value => this.setState({ paymentMethod: value })}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RadioButton status={this.state.paymentMethod == "online" ? "checked" : "unchecked"}
                               color={globalStyles.orangeThemeColor} value="online" />
                  <Text onPress={() => this.setState({ paymentMethod: "online" })} style={{ fontSize: wp(3.2), color: "gray" }}>
                    Pay Now (UPI / Card / Wallet / Net Banking)</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RadioButton status={this.state.paymentMethod == "COD" ? "checked" : "unchecked"}
                               color={globalStyles.orangeThemeColor} value="COD" />
                  <Text onPress={() => this.setState({ paymentMethod: "COD" })} style={{ fontSize: wp(3.2), color: "gray" }}>Cash on Delivery ( COD )</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          <View style={{alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Cart")} style={{
              height: hp(7),
              width: wp("50%"),
              alignItems: "center",
              justifyContent: "center",
              marginRight: wp(1),
              marginTop:wp(1),
              flexDirection: "row",
              backgroundColor: globalStyles.secondaryThemeColor,
            }}>
              <Text style={{ fontSize: wp(3.8), color: "white" }}
                    onPress={() => console.log("")}
              >{"CANCEL "}</Text>
              <MaterialIcons name={"cancel"} color="white" size={wp(4)} />
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => await this.orderNow()} style={{
              height: hp(7),
              width: wp("48%"),
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: globalStyles.orangeThemeColor,
            }}>
              <Text style={{ fontSize: wp(3.8), color: "white" }}
              >{"ORDER NOW "}</Text>
              <AntDesign name={"rightcircle"} color="white" size={wp(4)} />
            </TouchableOpacity>
          </View>
          {
            isLoading &&
            <Loader visible={isLoading} isLoading={isLoading} />
          }
        </ScrollView>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          animationType="slide"
          height={hp(45)}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <View style={{ flex: 1, backgroundColor: globalStyles.secondaryThemeColor }}>
            <FlatList
              style={{ paddingTop: wp(4), paddingLeft: wp(2) }}
              data={this.state.restaurantData}
              renderItem={({ item, index }) => this.bottomSheetData(item, index)}
              ItemSeparatorComponent={this.bottomSheetDataRenderSeparator}
              // keyExtractor={(item, index) => `post__${index}`}
              showsHorizontalScrollIndicator={false}
              horizontal
              // pagingEnabled={true}

            />          <View style={{
              flexDirection: "row",
              height: hp(7),
              width: "100%",
              position: "absolute",
              bottom: 0,
              backgroundColor: globalStyles.secondaryThemeColor,
            }}>
              <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: wp(3.5), color: "white" }}>Total Price </Text>
                <Text style={{ fontSize: wp(3),  color: "white" }}>₹ 565 </Text>
              </View>

              <View style={{
                flex: 2,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: globalStyles.orangeThemeColor,
              }}>
                <Text style={{ fontSize: wp(3),textAlign: "center", color: "white" }}>Order
                  Now</Text>
                {/* <Ionicons name={'cart-outline'} color="white" size={wp(4)} /> */}
              </View>
            </View>
          </View>
        </RBSheet>
        {true && getTimeSlotPopup(this.state, this.setModalVisible, this.selectTimeSlot)}
      </SafeAreaView>
    );
  }
}
