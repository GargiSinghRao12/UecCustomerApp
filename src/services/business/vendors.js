import UserApi from "../UserApi";
import AppConfig from "../../components/constants/AppConfig";

export let getNearByVendors = async (lat, long) => {
  let vendors = await UserApi.getNearestStores(lat, long);
  setImagePath(vendors)
  return vendors;
};

export let getVendorsByCategory = async (lat, long, category) => {
  let request = {
    categoryId: category,
    latitude: lat,
    longitude: long
  }
  let vendors = await UserApi.getVendorsList(request);
  setImagePath(vendors)
  return vendors;
};

function setImagePath(vendors) {
  if (vendors && vendors.length > 0) {
    vendors.forEach(item => {
      item.thumbnailImageUrl = AppConfig.BASE_URL + item.thumbnailImageUrl;
      item.distance = item.distance.toFixed(2);
      item.time = Math.floor(Math.random() * (19 - 2 + 1)) + 2
    });
  }
}
