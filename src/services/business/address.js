import { getItem, getItemJson, setItemJson, StorageKeys } from "../localstore/StorageService";
import UserApi from "../UserApi";

export let getDefaultAddress = async () => {
  let userId = await getItem(StorageKeys.UserId);
  let address = await getItemJson(StorageKeys.HomeLocation);
  if (address) {
    return address;
  }

  //get actual user addresses and take last one
  let addresses = await UserApi.getAddress(userId);
  if (addresses && addresses.addresses && addresses.addresses.length > 0) {
    let lastAddedAddress = addresses.addresses[addresses.addresses.length - 1];
    await setItemJson(StorageKeys.HomeLocation, lastAddedAddress);
    return lastAddedAddress;
  } else {
    return null;
  }
};

export let setDefaultAddress = async (address) => {
  await setItemJson(StorageKeys.HomeLocation, address);
};

export let makeLastDefaultAddress = async () => {
  let userId = await getItem(StorageKeys.UserId);
  let addresses = await UserApi.getAddress(userId);
  if (addresses && addresses.addresses && addresses.addresses.length > 0) {
    let lastAddedAddress = addresses.addresses[addresses.addresses.length - 1];
    await setItemJson(StorageKeys.HomeLocation, lastAddedAddress);
    return lastAddedAddress;
  } else {
    return null;
  }
};
