import AsyncStorage from "@react-native-async-storage/async-storage";
import { SigningOut } from "../components/common/Helper";
import { getItem, StorageKeys } from "./localstore/StorageService";

class _ApiCalling {
    authpost = async (url, body, props) => {
        console.log("calling signin api ===   ",url)
        console.log("calling signin api body  ===   ",body)
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'appversion': "0.0.1"
            },
            body: JSON.stringify(body)
        });
        console.log("API response  =====",response)
        let rawResponse = await response.json();
        console.log("API sdffdyfuiyouytrewerteyiuy response  =====",rawResponse)
        if (rawResponse && rawResponse.token) {
            return rawResponse
        } else if (rawResponse.statusCode == 403) {
            SigningOut(props);
        } else {
            return rawResponse
        }
    }

    post = async (url, body, props) => {
       try{
           const value = await getItem(StorageKeys.Token);
           console.log("token ", value);
           // console.log("value", url, body)
           let response = await fetch(url, {
               method: 'POST',
               headers: {
                   'Authorization': 'bearer ' + value,
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'appversion': "0.0.1"
               },
               body: JSON.stringify(body)
           });
           let rawResponse = await response.json();
           if (rawResponse) {
               return rawResponse
           } else if (rawResponse.statusCode == 403) {
               SigningOut(props);
           }
       }catch (ex){
           console.log("error in posting for " + url + " ", ex);
           return null;
       }
    }

    getWithoutAuth = async (url) => {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'appversion': "0.0.1"
            },
        });

        let rawResponse = await response.json();
        if (rawResponse) {
            return rawResponse
        } else {
            return null;
        }
    }

    postCheckoutAddress = async (url, body, props) => {
        const value = await AsyncStorage.getItem('token')
        // console.log("value", url, body)
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + value,
                'Content-Type': 'multipart/form-data',

            },
            body: body
        });
        // console.log("@@@@@@@1", response)

        let rawResponse = await response.json();
        // console.log("**********88iaddress", rawResponse)
        if (rawResponse) {
            return rawResponse
        } else if (rawResponse.statusCode == 403) {
            SigningOut(props);
        } else {
            let data = { code: rawResponse.statusCode, data: rawResponse.data, message: rawResponse.message, }
            return data
        }
    }

    forgotpost = async (url, body, props) => {
        const value = await AsyncStorage.getItem('forgottoken')
        console.log("new token value------------TTTTTTTTTTT", value);
        console.log("valueDDDDDDD", url, body)
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + value,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'appversion': "0.0.1"
            },
            body: JSON.stringify(body)
        });
        let rawResponse = await response.json();
        if (rawResponse) {
            return rawResponse
        } else if (rawResponse.statusCode == 403) {
            SigningOut(props);
        } else {
            let data = { code: rawResponse.statusCode, data: rawResponse.data, message: rawResponse.message, }
            return data
        }
    }

    get = async (url, props) => {
        try{
          const value = await getItem(StorageKeys.Token)
          let response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + value,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'appversion': "0.0.1"
            },
          });
          let rawResponse = await response.json();
          if (rawResponse) {
            return rawResponse
          } else{
            return null;
          }
        }catch (ex){
          console.log("exception in get ", ex);
          return null;
        }
    }

    getState = async (url, props) => {
        // console.log("Hello You are in getState API.js Function........");
        try{
          const value = await getItem(StorageKeys.Token)
          let response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + value,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'appversion': "0.0.1"
            },
          });
          let rawResponse = await response.json();
        //   console.log("rawResponse Data..........", rawResponse);
          if (rawResponse) {
            return rawResponse
          } else{
            return null;
          }
        }catch (ex){
          console.log("exception in get ", ex);
          return null;
        }
    }

    getLocation = async (url, props) => {
        let response = await fetch(url);
        let rawResponse = await response.json();
        // console.log("@@@@@", rawResponse)
        if (typeof Object.keys == 'function')
            var length = function (x) { return Object.keys(x).length; };
        else
            var length = function () { };
        var location = {};
        for ( var i = 0; i < rawResponse.results[0].address_components.length; ++i) {
            var component = rawResponse.results[0].address_components[i];
            if (!location.state && component.types.indexOf("administrative_area_level_1") > -1)
                location.state = component.long_name;
            if (!location.postal_code && component.types.indexOf("postal_code") > -1)
                location.postal_code = component.long_name;
            if (!location.locality && component.types.indexOf("locality") > -1)
                location.locality = component.long_name;
            if (!location.sublocality && component.types.indexOf("sublocality") > -1)
                location.sublocality = component.long_name;
            if (!location.premise && component.types.indexOf("premise") > -1)
                location.premise = component.long_name;
            // nothing will happen here if `Object.keys` isn't supported!
            if (length(location) == 5)
                break;
        }

        await AsyncStorage.setItem('userLocation', JSON.stringify(location))
        // console.log("@@@@@@@@@@@@@@@@", location)

        // rawResponse = rawResponse.results[0].formatted_address
        let address1 = rawResponse.results[0].address_components[0].long_name;
        let address2 = rawResponse.results[0].address_components[1].long_name;
        rawResponse = address1 + " " + address2
        // console.log("final raw", rawResponse)
        if (rawResponse) {
            return rawResponse
        } else if (rawResponse.statusCode == 403) {

        } else {

            return data
        }
    }

    put = async (url, body, props) => {
        const value = await AsyncStorage.getItem('token')
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'bearer ' + value,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'appversion': "0.0.1"
            },
            body: JSON.stringify(body)
        });
        let rawResponse = await response.json();
        if (rawResponse.statusCode == 200) {
            let data = { code: rawResponse.statusCode, data: rawResponse.data, message: rawResponse.message }
            return data
        } else if (rawResponse.statusCode == 403) {
            SigningOut(props);
        } else {
            let data = { code: rawResponse.statusCode, data: rawResponse.data, message: rawResponse.message, }
            return data
        }
    }
}

const ApiCalling = new _ApiCalling();
export default ApiCalling;
