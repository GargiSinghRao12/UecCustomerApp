import { simpleToast } from "../utility/toastMessage";
import UserApi from "../UserApi";
import RazorpayCheckout from "react-native-razorpay";
import { Alert } from "react-native";

export let checkout = async (state, navigateToScreen, setLoading) => {
  const { selectedAddress, selectedTimeSlotId, walletApplied } = state;
  let selectedWallet = walletApplied;
  let isSuccess = false;
  try {

    if (selectedAddress && selectedAddress !== null && selectedAddress !== undefined && selectedTimeSlotId && selectedTimeSlotId !== null) {
      let body = {
        "ShippingAddressId": selectedAddress.userAddressId,
        "UseShippingAddressAsBillingAddress": true,
        "ShippingMethod": "Free",
        "NewBillingAddressForm": {},
        "DeliverySlot": selectedTimeSlotId,
      };
      if (selectedWallet == "wallet") {
        body.Ewallet = true;
      }
      if (selectedWallet == "rwallet") {
        body.Rwallet = true;
      }

      setLoading(true);
      let response = await UserApi.saveCheckoutAddress(body);
      console.log("checkout response ", response);
      if (response && response !== null && !response.error) {
        isSuccess = true;
      } else {
        simpleToast(response.error ? response.error : "Details are not correct. Please try again");
      }
    } else {
      simpleToast("Please select an address and time slot!");
    }
  } catch (error) {
    simpleToast("Unable to place your order at this time. Please try again");
    console.log("error in checkout ", error);
  } finally {
    setLoading(false);
  }

  return isSuccess;
};

export let cashCollectedOnDelivery = (navigateToScreen) => {
  Alert.alert(
    "Delivery",
    "You have chosen cash on delivery. Do you want to continue ?",
    [
      {
        text: "Cancel", onPress: () => {
          return null;
        },
      },
      {
        text: "Confirm", onPress: async () => {
          await cashOnDelivery(navigateToScreen);
        },
      },
    ],
    { cancelable: false },
  );
};

let cashOnDelivery = async (navigateToScreen) => {
  try {
    let response = await UserApi.getCashDelivery();
    paymentDone((response && response.message == "ordered successfully"), navigateToScreen);
  } catch (error) {
    console.log("error", error);
  }
};

export let razorpayPayment = (state, navigateToScreen, setLoading) => {
  let options = {
    description: "UEC",
    image: "https://i.imgur.com/3g7nmJC.png",
    currency: "INR",
    key: state.razorpay.appId,
    amount: state.razorpay.amount,
    name: "UEC ",
    payment_capture: 1,
    order_id: state.razorpay.orderId,
    prefill: {
      email: state.razorpay.customerEmail,
      contact: state.razorpay.customerPhone,
      name: state.razorpay.customerName,
    },
    theme: { color: "#53a20e" },
  };

  if (state.razorpay.mode === "TEST") {
    delete options.order_id;
  }

  RazorpayCheckout.open(options).then((data) => {
    if (state.razorpay.mode === "TEST") {
      data.razorpay_order_id = state.razorpay.orderId;
    }
    setLoading(true);
    UserApi.chargeRazorPay(data).then((resp) => {
      setLoading(false);
      paymentDone(resp.status === "success", navigateToScreen);
    });
  }).catch((error) => {
    console.log("error in payment ", error);
    paymentDone(false, navigateToScreen);
  });
};

export let paymentDone = (isSuccess, navigateToScreen) => {
  if (isSuccess) {
    navigateToScreen("Order Placed");
  } else {
    simpleToast("Order failed. Please try again");
  }
};


