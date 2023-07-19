import UserApi from "../../services/UserApi";
import { simpleToast } from "../utility/toastMessage";
import Toast from "react-native-simple-toast";

export let getEWalletBalance = async () => {
  let balance = await UserApi.getEWallet();
  if (balance) {
    return balance.balance;
  } else {
    return 0;
  }
};

export let getRWalletBalance = async () => {
  let balance = await UserApi.getRWallet();
  if (balance) {
    return balance.balance;
  } else {
    return 0;
  }
};

export let applyEWalletDiscount = async (cart) => {
  try {
    let response = await UserApi.applyEWalletDiscountPrice();
    if (response && response.value.walletDiscount) {
      simpleToast("Wallet discount applied");
    } else {
      simpleToast("Can not apply wallet discount");
    }
  } catch (error) {
    simpleToast("Can not apply wallet discount");
  }
};

export let applyRWalletDiscount = async (cart) => {
  if (cart && cart.orderTotal <= 200) {
    simpleToast("Order Total must be above ₹200 to use this wallet balance");
  } else {
    try {
      let response = await UserApi.applyRWalletDiscountPrice();
      if (response && response.value.walletDiscount) {
        simpleToast("Wallet discount applied");
      } else {
        simpleToast("Can not apply wallet discount");
      }
    } catch (error) {
      simpleToast("Can not apply wallet discount");
    }
  }
};
