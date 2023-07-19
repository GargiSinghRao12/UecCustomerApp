import UserApi from "../UserApi";

export let getAllCoupon = async () => {

};

export let applyCoupon= async (code)=>{
  let data = {
    couponCode: code
  }
  try {
    let resp = await UserApi.usePromoCode(data);
    // console.log("#############-----Promo code Response-->>>", resp)
    if ((resp == null) || (resp && resp.errorMessage)) {
      return false;
    } else {
      return true
    }

  } catch (error) {
    console.log("error in coupon code ", error);
    return false;
  }
}
