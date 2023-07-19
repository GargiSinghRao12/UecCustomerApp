import AsyncStorage from "@react-native-async-storage/async-storage";

export let getItem = async (key) => {
  return await AsyncStorage.getItem(key);
};

export let setItem = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export let getItemJson = async (key) => {
  let rawJson = await getItem(key);
  let json = null;
  if (rawJson) {
    json = JSON.parse(rawJson);
  }
  return json;
};

export let cleanStorage = async ()=>{
  await AsyncStorage.clear();
}

export let setItemJson = async (key, json) => {
  let rawJson = JSON.stringify(json);
  await setItem(key, rawJson);
};

export let StorageKeys = {
  User: "User",
  Token: "token",
  UserId: "userId",
  Address: "Address",
  HomeLocation: "defaultAddress",
  GuestUser: "guestUser",
  PhoneNumberConfirmed: "phoneNumberConfirmed",
  GuestUserEmail: "guestUserEmail",
  LoggedInUser: "loggedInUser",
  SystemSettings: "systemSettings",
  Categories : "categories"
};

