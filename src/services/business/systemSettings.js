import CommonApi from "../CommonApi";
import { getItemJson, setItemJson, StorageKeys } from "../localstore/StorageService";

export let getSystemSettings = async (forceNew = false) => {
  let settings = null;
  let systemSettings = [];
  if (forceNew) {
    systemSettings = await CommonApi.getSystemSettings();
  } else {
    let cached = await getItemJson(StorageKeys.SystemSettings);
    if (cached) {
      settings = cached;
    } else {
      systemSettings = await CommonApi.getSystemSettings();
    }
  }

  if (settings != null) return settings;

  if (systemSettings && systemSettings.length > 0) {
    settings = {};
    systemSettings.forEach(item => {
      settings[item.key] = item.value;
    });
  } else {
    settings = {
      AllowOnTimeDelivery: "true",
      AllowSlotDelivery: "true",
      IsMultiVendorApp: "true",
      IsFoodAppView: "true"
    };
  }

  await setItemJson(StorageKeys.SystemSettings, settings);
  return settings;
};
