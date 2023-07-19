import UserApi from "../UserApi";
import {
  Alert,
} from "react-native";
import AppConfig from "../../components/constants/AppConfig";

export let getCartItems = async () => {
  let cartData = await UserApi.getCartItem(this.props);
  setImagePath(cartData);
  return cartData;
};

export let getTotalCartItemCount = async (cart = null) => {
  let cartData = cart != null ? cart : await getCartItems();
  if (cartData && cartData.items && cartData.items.length > 0) {
    let sum = 0;
    cartData.items.forEach(item => sum = sum + item.quantity);
    return sum;
  } else {
    return 0;
  }
};

export let addProductIntoCart = async (productId, quantity = 1) => {
  await UserApi.unlockCart();
  let body = {
    "productId": productId,
    "quantity": quantity,
  };
  let response = await UserApi.addProductToCart(body);
  if (response && response.error) {
  }
  console.log("cart add response ", response);
  return response;
};

export let increaseProductIntoCart = async (item) => {
  await UserApi.unlockCart();
  let result = {};
  let cartItems = await getCartItems();
  // console.log("incrementCounter cartItems", cartItems)
  try {
    let filterItems = cartItems.items.filter((data) => data.productId === item.id || data.mainProductId === item.id);
    // console.log("filter items", filterItems)
    let resultId = filterItems.map(a => a.id);
    let resultQuantity = filterItems.map(a => a.quantity);
    // console.log("resultQuantity", resultQuantity)
    let body = {
      "cartItemId": resultId[0],
      "quantity": resultQuantity[0] + 1,

    };
    let response = await UserApi.updateProductToCart(body);
    if (response) {
      result = {
        code: "increased",
        message: "updated cart quantity",
      };
    }

  } catch (error) {
    result = {
      code: "error",
      message: "unable to update cart",
    };
  }

  return result;
};


export let decreaseProductFromCart = async (item) => {
  await UserApi.unlockCart();
  let result = {};
  let cartItems = await getCartItems();
  try {
    let filterItems = cartItems.items.filter((data) => data.productId === item.id || data.mainProductId === item.id);
    let resultId = filterItems.map(a => a.id);
    let resultQuantity = filterItems.map(a => a.quantity);
    let body = {
      "cartItemId": resultId[0],
      "quantity": resultQuantity[0] - 1,
    };
    if (body.quantity === 0) {
      try {
        let response = await UserApi.removeProductFromCart(resultId[0]);
        if (response) {
          result = {
            "code": "removed",
            "message": "product removed from cart",
          };
        }
      } catch (error) {
        result = {
          "code": "error",
          "message": "Unable to removed product from cart",
        };
        console.log(error);
      }

    } else {
      try {
        let response = await UserApi.updateProductToCart(body);
        if (response) {
          result = {
            "code": "decreased",
            "message": "product removed from cart",
          };
        }
      } catch (error) {
      }
    }
  } catch (error) {
    result = {
      "code": "error",
      "message": "Unable to removed product from cart",
    };
  }
  return result;
};

export let clearCart = async (cb) => {
  Alert.alert(
    "Delete",
    "Are you sure you wants to clear all your cart items?",
    [
      {
        text: "Cancel", onPress: async () => {
          return null;
        },
      },
      {
        text: "Confirm", onPress: async () => {
          try {
            await UserApi.clearCart();
            await cb();
          } catch (error) {
            console.log(error);
            await cb();
          }
        },
      },
    ],
    { cancelable: false },
  );
};

export let isProductInCart = (productId, variants, cartData) => {
  if (cartData == null) return null;
  let filterItems = cartData.items.filter((data) => data.productId === productId
    || data.mainProductId === productId);
  if (filterItems.length > 0) return filterItems[0];
  if (variants && variants.length > 0) {
    filterItems = cartData.items.filter((data) => variants.find(x => x = data.productId).length > 0
      || variants.find(x => x = data.mainProductId).length > 0);
    if (filterItems.length > 0) return filterItems[0];
  }
  return null;
};


function setImagePath(cartData) {
  if (cartData && cartData.items && cartData.items.length > 0) {
    cartData.items.forEach(item => {
      item.productImage = AppConfig.BASE_URL + item.productImage;
    });
  }
}
