import { SERVICE_URL } from "../components/constants/Service";
import AppConfig from "../components/constants/AppConfig";
import ApiCalling from "./Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { simpleToast } from "../services/utility/toastMessage";

class _commonApi {
  setFCMToken = async (fcmToken, props) => {
    let userId = await AsyncStorage.getItem("driverId");
    let body = {
      "id": userId,
      "fcmId": fcmToken,
    };
    try {
      let url = AppConfig.BASE_URL + SERVICE_URL.GET_DRIVER;
      let ApiResponse = await ApiCalling.put(url, body, props);
      if (ApiResponse.code == 200) {
        return ApiResponse;
      } else {
        if (ApiResponse.message) {
          simpleToast(
            ApiResponse.message
          );
        }
        return ApiResponse;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getSystemSettings = async () => {
    let url = AppConfig.BASE_URL + SERVICE_URL.GET_SYSTEM_SETTINGS + AppConfig.SystemApiKey;
    let apiResponse = await ApiCalling.getWithoutAuth(url);
    return apiResponse;
  };
}


const CommonApi = new _commonApi();
export default CommonApi;
