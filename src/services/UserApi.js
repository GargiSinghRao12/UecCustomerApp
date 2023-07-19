import { SERVICE_URL } from "../components/constants/Service";
import AppConfig from "../components/constants/AppConfig";
import ApiCalling from "./Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from 'native-base';
import { globalStyles} from '../components/styles/globalStyles'
import { setItem, setItemJson, StorageKeys } from "./localstore/StorageService";
import { simpleToast } from "../services/utility/toastMessage";

class _userApi {

    authUserSignin = async (body, props) => {
        console.log("@@@@@@", body)
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.AUTH_USER_SIGNIN
            console.log(url)
            let ApiResponse = await ApiCalling.authpost(url, body, props)
            console.log("Sign in Response", ApiResponse)
            if (ApiResponse && ApiResponse.token) {


            } else {
                console.log("sddgddsd", ApiResponse)
                simpleToast(
                    ApiResponse.error
                );
                simpleToast({
                    text: ApiResponse.error,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })

            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    authUserSignup = async (body, props) => {
        console.log("sign up body at user API  ", body)
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.AUTH_USER_SIGNUP
            console.log("signup url      ==   ",url)
            let ApiResponse = await ApiCalling.authpost(url, body, props)
            console.log("Sign up Response at user API ", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else if (ApiResponse.error[0].description) {
                console.log("sddgddsd", ApiResponse)
                simpleToast({
                    text: ApiResponse.error[0].description,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                })
                return null;
            } else {
                simpleToast({
                    text: ApiResponse.error[0],
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                })

                return null;
            }
        } catch (error) {
            console.log(error)
        }
    }

    getVendorsList = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_VENDOR_LIST + "/" + body.categoryId + "/" + body.latitude + "/" + body.longitude;
            let ApiResponse = await ApiCalling.get(url, props)
            return ApiResponse;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    getProfileData = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_PROFILE;
           // console.log("getProfileData ", url);
            let ApiResponse = await ApiCalling.get(url, props)
            if (ApiResponse.code == 200) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    fetchLiveLocation = async (latitude, longitude, props) => {
        try {
            let url = AppConfig.BASE_URL1 + SERVICE_URL.FETCH_LOCATION + latitude + ',' + longitude + '&key=' + AppConfig.API_KEY;
            // console.log("fetchLiveLocation ", url);
            let ApiResponse = await ApiCalling.getLocation(url, props)
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!", ApiResponse)
            if (ApiResponse.code == 200) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    searchItem = async (item, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.SEARCH_TEXT + "/" + item + "/all";
            // console.log("search", url)
            let ApiResponse = await ApiCalling.get(url, props);
            // console.log("******", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }


    getUserOrders = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_ORDERS;
            let ApiResponse = await ApiCalling.get(url, props)
            return ApiResponse;
        } catch (error) {
            console.log("error in fetching orders ", error);
            return null;
        }
    }

    getBillingDetails = async (orderID, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_BILLING_DETAILS + "/" + orderID;
            // console.log("getUserOrders ", url);
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("Billing API response ====", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            // console.log(error)
        }
    }

    getNearestStores = async (lat, long, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_NEAREST_STORES + "/" + lat + "/" + long;
            // console.log("vendor list api", url);
            return await ApiCalling.get(url, props);

        } catch (error) {
            return null
        }
    }

    searchProduct = async(searchType, searchOptions, lat, long) =>{
      try{
        let keys = Object.keys(searchOptions);
        let queryString = "?";
          keys.forEach(key=> {
              console.log("keys ", key);
              if(searchOptions[key]){
                  queryString+= key + "=" + searchOptions[key] + "&";
              }
          })
        let url = "";
        if(searchType === "product"){
          url = AppConfig.BASE_URL + SERVICE_URL.SearchProduct + lat  + "/" + long;
        }else{
          url = AppConfig.BASE_URL + SERVICE_URL.SearchVendor + lat  + "/" + long;
        }

        url += queryString;
        console.log("url requested ", url);
        return await ApiCalling.get(url, null);
      }catch (ex){
        return null;
      }
    }

    getRecentProducts = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_RECENT_PRODUCTS;
            console.log("recent products ", url);
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("vendor list api", url);
            // console.log("recent products at userAPI = ",ApiResponse)
            if (ApiResponse.code == 200) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            // console.log(error)
        }
    }

    getUserOrders = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_ORDERS;
            // console.log("getUserOrders ", url);
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("@@@@@@@", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    saveAddress = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.SAVE_ADDRESS
            // console.log("getUserOrders ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("saveAddress", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }

            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    editAddress = async (body, id, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.EDIT_ADDRESS + "/" + id;
            // console.log("getUserOrders ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, id, props)
            // console.log("saveAddress", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                // simpleToast(
                //     ApiResponse.message
                // );
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })

            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    deleteSelectedAddress = async (id, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.DELETE_ADDRESS + "/" + id;
            // console.log("deleteSelectedAddress ", url);
            let ApiResponse = await ApiCalling.post(url, props)
            // console.log("delete apiresposne", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }

            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    addProductToCart = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.ADD_PRODUCT_TO_CART;
            let ApiResponse = await ApiCalling.post(url, body, props)
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    unlockCart = async () => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.UNLOCK_CART;
            let ApiResponse = await ApiCalling.post(url, {  }, null)
            return ApiResponse;
        } catch (error) {
            console.log("error in unlocking cart ", error)
        }
    }

    updateProductToCart = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.UPDATE_PRODUCT_TO_CART;
            // console.log("getUserOrders ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("updateProductToCart", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                // simpleToast(
                //     ApiResponse.message
                // );
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    removeProductFromCart = async (itemId, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.REMOVE_PRODUCT_FROM_CART + "/" + itemId;
            // console.log("getUserOrders ", url);
            let ApiResponse = await ApiCalling.post(url, props)
            // console.log("removeProductFromCart", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                // simpleToast(
                //     ApiResponse.message
                // );
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    clearCart = async (props) => {
        // console.log("romvie item---------------", itemId)
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.CLEAR_CART;
            // console.log("clear cart url ", url);
            let ApiResponse = await ApiCalling.post(url, props)
            // console.log("clear cart api response 111 ", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyle.primaryThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log("error occured=== ", error)
        }
    }

    returnProducts = async (parentOrderID, childOrdersIDs, returnReasonID, props) => {
        console.log("userAPI return data ---------------", parentOrderID, "  ", +childOrdersIDs)
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.RETURN_PRODUCTS + "/" + parentOrderID + "/" + childOrdersIDs.join(",") + "/" + returnReasonID;
            console.log("return request url ==== ", url);
            let ApiResponse = await ApiCalling.post(url, props)
            // console.log("return api response   = ", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyle.primaryThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            // console.log(error)
        }
    }

    updateUserProfile = async (data, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.UPDATE_USER;// url
            let ApiResponse = await ApiCalling.put(url, data, props);
            if (ApiResponse.code == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getVendorProduct = async (id, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_PPRODUCTLIST + '/' + id;
            // console.log("get vendor product data", url);
            let ApiResponse = await ApiCalling.get(url, props)
            if (ApiResponse.code == 200) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getCartItem = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_CARTLIST;
            return await ApiCalling.get(url, props)
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    getCashDelivery = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_CASH_DELIVERY;
            let ApiResponse = await ApiCalling.get(url, props);
            return ApiResponse;
        } catch (error) {
            console.log("error in cash api ",error);
            return null;
        }
    }

    getAllCategories = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_CATEGORY_LIST;
            // console.log("get category", url);
            let ApiResponse = await ApiCalling.get(url, props)
           // console.log("getAllCategories", ApiResponse)
            if (ApiResponse.code == 200) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getSliderData = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_SLIDER_DATA;
            // console.log("slider data url", url);
            let ApiResponse = await ApiCalling.get(url, props)
            return ApiResponse;
        } catch (error) {
            console.log("error in getting slider data", error)
          return null;
        }
    }

    getWidgetData = async()=>{
      try {
        let url = AppConfig.BASE_URL + SERVICE_URL.GET_WIDGET_PRODUCTS;
        // console.log("slider data url", url);
        let apiResponse = await ApiCalling.get(url)
        // console.log("slider data userApi response", ApiResponse)
        if (apiResponse) {
          return apiResponse.data
        }

        return null;
      } catch (error) {
        console.log("error in getting slider data", error)
        return null;
      }
    }


    getAddress = async (userId, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_ADDRESS_LIST + "/" + userId;
            // console.log("get category", url);
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("getAllCategories", ApiResponse)
            if (ApiResponse.code == 200) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getOTP = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_OTP;
            // console.log("get category", url);
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("getOTP", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    verifyOTP = async (otp, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.VERIFY_OTP + "/" + otp;
            // console.log("get category", url);
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("verifyOTP", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getTimeSlots = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_TIME_SLOTS;
            let ApiResponse = await ApiCalling.get(url, props)
            if (ApiResponse && ApiResponse.data) {
                return ApiResponse.data
            }else{
                return ApiResponse;
            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    getRazorPayDetails = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_RAZORPAY_SETTINGS;
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("get razor pay settings", ApiResponse)
            if (ApiResponse.code == 200) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getReferral = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_REFERRAL_CODE;
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("getReferral", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    guestUserLogin = async (body, props) => {
        try {
            console.log("are we on guest user then ?");
            let url = AppConfig.BASE_URL + SERVICE_URL.Guest_User_Login
            let apiResponse = await ApiCalling.getWithoutAuth(url)
            console.log("guest user data ", apiResponse);
            await setItem(StorageKeys.Token, apiResponse.token);
            await setItem(StorageKeys.UserId, apiResponse.user.id.toString())
            await setItem(StorageKeys.PhoneNumberConfirmed, JSON.stringify(true));
            await setItem(StorageKeys.GuestUserEmail, apiResponse.user.email)
            await setItemJson(StorageKeys.GuestUser, apiResponse.user);
            return apiResponse;
        } catch (error) {
        }
    }

    getEWallet = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_E_WALLET_BALANCE;
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("getEWallet", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getRWallet = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_R_WALLET_BALANCE;
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("getRWallet", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getPackSize = async (productId, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_MULTIPLE_PACK_SIZE + "/" + productId;
            let ApiResponse = await ApiCalling.get(url, props)
            return ApiResponse;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    chargeRazorPay = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.CHARGE_RAZORPAY;
            // console.log("charge razor pay ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("addProductToCart", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                // simpleToast(
                //     ApiResponse.message
                // );
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    saveCheckoutAddress = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.SAVE_CHECKOUT_ADDRESS;
            // console.log("saveCheckoutAddress ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("saveCheckoutAddress-------------", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                // simpleToast(
                //     ApiResponse.message
                // );
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    updateShippingPrices = async (data, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.UPDATE_PRICE;
            // console.log("url of update shippping prices api--- ", url, data);
            let ApiResponse = await ApiCalling.post(url, data, props)
            // console.log("response of update shipping price api$$$$$$$$$$$", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                // simpleToast(
                //     ApiResponse.message
                // );
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getOtpPhone = async (phoneNumber, props) => {
        console.log("Send otp on this Mobile number--------", phoneNumber);
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_OTP_BY_PHONE + '?phoneNumber=' + phoneNumber;
            console.log("url of get otp by Mobile number--------", url);
            let ApiResponse = await ApiCalling.get(url, props)
            console.log("generate otp by Mobile number", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    varifyOtpPhone = async (otp, phoneNumber, props) => {
        console.log("get otp Mobile number--------", otp, phoneNumber);
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.VARIFY_OTP_BY_PHONE + "/" + otp + '?phoneNumber=' + phoneNumber;
            console.log("url of varified otp by Mobile number ++++++++++", url);
            let ApiResponse = await ApiCalling.get(url, props)
            console.log("generate otp by Mobile number", ApiResponse)
            if (ApiResponse && ApiResponse.token) {
                await AsyncStorage.setItem('forgottoken', ApiResponse.token)

            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getOtpEmail = async (emailAddress, props) => {
        console.log("get otp email address--------", emailAddress);
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_OTP_BYMAIL + '?emailAddress=' + emailAddress;
            console.log("url of get otp by email--------", url);
            let ApiResponse = await ApiCalling.get(url, props)
            console.log("generate otp by email", ApiResponse)
            if (ApiResponse.code == 200) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    varifyOtpMail = async (otp, emailAddress, props) => {
        // console.log("get otp email address--------", otp, emailAddress);
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.VARIFY_OTP_BYMAIL + "/" + otp + '?emailAddress=' + emailAddress;
            // console.log("url of varified otp by email ++++++++++", url);
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("generate otp by email", ApiResponse)
            if (ApiResponse && ApiResponse.token) {
                await AsyncStorage.setItem('forgottoken', ApiResponse.token)

            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyles.thirdThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    modifyPassword = async (body, props) => {
        console.log("body of modify password-------------", body);
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.CHANGE_PASSWORD;
            console.log("change password url@@@@@@@@@@@@@@@", url);
            let ApiResponse = await ApiCalling.forgotpost(url, body, props)
            console.log("Modified Password Response--", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
                console.log("Api response",ApiResponse.message);
            } else {
                // simpleToast(
                //     ApiResponse.message
                // );
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    cancel_Order = async (orderID, body, props) => {
        // console.log("order id at user api = ",orderID)
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.CANCEL_ORDER + '/' + orderID;
            // console.log("Cancel Order url@@@@@@@@@@@@@@@", url);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("cancel order api response",ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                simpleToast(
                  ApiResponse.message
                );

            }
            return ApiResponse;
        } catch (error) {
            // console.log(error)
        }
    }

    updateUserInfo = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.UPDATE_USER_INFO;
            // console.log("updateUserInfo => ", url);
            let ApiResponse = await ApiCalling.put(url, body, props)
            if (ApiResponse) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    simpleToast(
                      ApiResponse.message
                    );
                }
            }
            return ApiResponse;
        } catch (error) {
            // console.log(error)
        }
    }

    usePromoCode = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.APPLY_PROMO_CODE
            let ApiResponse = await ApiCalling.post(url, body, props);
            console.log("applied coupom response ", ApiResponse);
            // console.log("promo code response in user api--->", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                return null;
            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    submitVendorReview = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.SUBMIT_VENDOR_REVIEW;
            // console.log("submitVendorReview urllll----- ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("submitVendorReview response in user api--->", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.errorMessage) {
                    simpleToast({
                        text: ApiResponse.errorMessage,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }

            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    submitDriverReview = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.SUBMIT_DRIVER_REVIEW;
            // console.log("submitDriverReview----- ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("submitDriverReview response in user api--->", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                if (ApiResponse.errorMessage) {
                    simpleToast({
                        text: ApiResponse.errorMessage,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }

            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getItemByCategory = async (Vender_id, category_id, props) => {

        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_ITEM_BY_CATEGORY + '/' + Vender_id + '?categoryId=' + category_id;
            // console.log("get item by category url@@@@@@@@@@@@@@@", url);
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("get item by category",ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                simpleToast(
                  ApiResponse.message
                );
            }
        } catch (error) {
            console.log(error)
        }
    }

    applyEWalletDiscountPrice = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_E_WALLET_DISCOUNT;
            // console.log("url of E wallet---------", url)
            let ApiResponse = await ApiCalling.get(url, props)
            if (ApiResponse && ApiResponse.data) {
                return ApiResponse.data
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    applyRWalletDiscountPrice = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_R_WALLET_DISCOUNT;
            let ApiResponse = await ApiCalling.get(url, props)
            if (ApiResponse.data) {
                return ApiResponse.data
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    getRWalletTransactionList = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_R_WALLET_TRANSACTION_LIST;
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("getRWalletTransactionList----- ", ApiResponse)
            if (ApiResponse.data) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getSanatanMoneyTransactionList = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_SANATAN_MONEY_TRANSACTION_LIST;
            // console.log("snantom money", url)
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("getSanatanMoneyTransactionList----- ", ApiResponse)
            if (ApiResponse.data) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    // simpleToast(
                    //     ApiResponse.message
                    // );
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getState = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_STATE;
            let ApiResponse = await ApiCalling.getState(url, props)   
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    getDistrict = async (selectedStateId) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_DISTRICT;
            if(selectedStateId){
                url= url.replace("33", selectedStateId);
            }
            let ApiResponse = await ApiCalling.get(url, null)
            if (ApiResponse.data) {
                return ApiResponse.data
            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    

    AgentSubscription = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.AGENT_SUBSCRIPTION;
            // console.log("cdm subscription---------- ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("agent subscription cdm--------@@@@", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyle.primaryThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    agentSubscriptionPurchased = async (body, props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.AGENT_SUBSCRIPTION_PURCHASED;
            // console.log("subscription purchased ", url, body);
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("subscription response", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                simpleToast({
                    text: ApiResponse.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyle.primaryThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }

    withDrawAmountRequest = async (body, props) => {
        // console.log("@@@@@@", body)
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.AMOUNT_WITHDRAW
            // console.log(url)
            let ApiResponse = await ApiCalling.post(url, body, props)
            // console.log("With draw amount response-----", ApiResponse)
            if (ApiResponse.statusCode == 200) {
                return ApiResponse
            } else {
                simpleToast({
                    text: ApiResponse.error,
                    buttonText: "Okay",
                    textStyle: { color: globalStyle.primaryThemeColor },
                    position: "bottom",
                    // duration: 10000,
                })

            }
            return ApiResponse;
        } catch (error) {
            // console.log(error)
        }
    }

    getWithDrawRequest = async (props) => {
        try {
            let url = AppConfig.BASE_URL + SERVICE_URL.GET_REQUEST_DETAILS;
            // console.log("url of request withdraw amount", url)
            let ApiResponse = await ApiCalling.get(url, props)
            // console.log("****************REQUEST RESPONSE", ApiResponse)
            if (ApiResponse) {
                return ApiResponse
            } else {
                if (ApiResponse.message) {
                    simpleToast({
                        text: ApiResponse.message,
                        buttonText: "Okay",
                        textStyle: { color: globalStyle.primaryThemeColor },
                        position: "bottom",
                        // duration: 10000,
                    })
                }
            }
            return ApiResponse;
        } catch (error) {
            console.log(error)
        }
    }
}

const UserApi = new _userApi();
export default UserApi;
