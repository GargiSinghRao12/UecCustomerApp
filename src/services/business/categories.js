import UserApi from "../UserApi";
import { getItemJson, setItemJson, StorageKeys } from "../localstore/StorageService";
import AppConfig from "../../components/constants/AppConfig";

export let getCategories = async (forceNew) => {
  console.log("category: 2")

  let categories = [];
  let cached = null;
  if (forceNew) {
    categories = await UserApi.getAllCategories();
    console.log("category: 3 ", categories);
    setImagePath(categories);
  } else {
    cached = await getItemJson(StorageKeys.Categories);
    console.log("category: 4", cached);
    if (cached == null || ((new Date().valueOf() - cached.date.valueOf()) / 1000) > 86400) {
      categories = await UserApi.getAllCategories();
      setImagePath(categories);
    }
  }

  if (categories && categories.length > 0) {
    let newCache = {
      date: new Date(),
      categories: categories,
    };

    await setItemJson(StorageKeys.Categories, newCache);
  } else if (cached != null) {
    categories = cached.categories;
  }

  return categories;
};

export let getMenuCategories = async (forceNew) => {
  console.log("category: 1")
  let allCategories = await getCategories(forceNew);
  let menus = [];
  if (allCategories && allCategories.length > 0) {
    menus = allCategories.filter(item => {
      return item.includeInMenu;
    });
  }
  console.log("category: 5",menus);

  return menus;
};

function setImagePath(categories) {
  if (categories && categories.length > 0) {
    categories.forEach(item => {
      item.thumbnailImageUrl = AppConfig.BASE_URL + item.thumbnailImageUrl;
    });
  }
}
