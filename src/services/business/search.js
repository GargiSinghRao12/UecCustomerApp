import UserApi from "../UserApi";
import AppConfig from "../../components/constants/AppConfig";

export let searchItem = async (searchType, searchOptions, lat, long) => {
  let searchResult = await UserApi.searchProduct(searchType, searchOptions, lat, long);
  if (searchResult) {
    searchResult.products = setImagePath(searchResult.products);
    searchResult.products = setTimeByDistance(searchResult.products);
    searchResult.vendors = setTimeByDistance(searchResult.vendors);
    searchResult.vendors = setImagePath(searchResult.vendors);
  }

  return searchResult;
};

function setTimeByDistance(products) {
  if (products && products.length > 0) {
    products.forEach(item => {
      let distance = item.distanceFromUser ? item.distanceFromUser : item.distance ? item.distance : 0;
      if (distance > 0) {
        item.deliveryTime = parseInt(distance) * 1.2;
      } else {
        item.deliveryTime = 0;
      }

      if (item.deliveryTime == 0) {
        item.deliveryTime = "30 min";
      } else if (item.deliveryTime > 60) {
        item.deliveryTime = "45 min";
      } else if (item.deliveryTime < 20) {
        item.deliveryTime = "25 min";
      } else {
        item.deliveryTime = parseInt(item.deliveryTime) + " min";
      }

      //set expenses of two people
      item.expenseOfTwo = Math.floor(Math.random() * 70) + 100;
      item.off = Math.trunc((Math.floor(Math.random() * 40) + 10) / 10 ) * 10;
    });
  }
  return products;
}

function setImagePath(items) {
  if (items && items.length > 0) {
    items.forEach(item => {
      if (item.thumbnailUrl) {
        item.thumbnailUrl = AppConfig.BASE_URL + item.thumbnailUrl;
      }
      if (item.thumbnailImageUrl) {
        item.thumbnailImageUrl = AppConfig.BASE_URL + item.thumbnailImageUrl;
        console.log(" item.thumbnailImageUrl ", item.thumbnailImageUrl);
      }
    });
  }
  return items;
}
