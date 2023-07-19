import React, { Component } from 'react';
import { BackHandler, Text, View, SafeAreaView, FlatList, Image, StyleSheet, Alert, AppState, ScrollView, TextInput, StatusBar, TouchableOpacity, Switch } from 'react-native';
import Swiper from 'react-native-swiper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AppTheme, { globalStyles } from '../styles/globalStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserApi from "../../services/UserApi";
import { cleanStorage } from "../../services/localstore/StorageService";
import RWalletIcon from "react-native-vector-icons/Fontisto";
import EWalletIcon from "react-native-vector-icons/FontAwesome5";
import {getDefaultAddress} from "../../services/business/address";
import PersonIcon from "react-native-vector-icons/FontAwesome";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import EditIcon from 'react-native-vector-icons/Entypo';



export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileResponse: undefined,
      isLoading: false,
      waitingLoaderVisible: false,
      selectedTheme: "dark",
      rewardWallet: null,
      sanatanWallet: null,
      emptyDataFlag: false,
      DefaultAddress: "",
      profilePhoto: undefined,
      cachedProfileEmail: undefined,
      appState: AppState.currentState,
    };
    this.unsubscribe = null;
    this.focusListener = null;
  }

  chooseProfilePhoto = async () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          profilePhoto: "file:///" + response.path,
        });
        let obj = {
          cachedProfileImage: "file:///" + response.path,
          cachedProfileEmail: this.state.profileResponse.email,
        }
        await AsyncStorage.setItem('cachedProfileData', JSON.stringify(obj))
        this.fetchCachedData();
      }
    });
  };

  fetchCachedData = async () => {
    try {
      let profileRaw = await AsyncStorage.getItem('cachedProfileData')
      let profileCachedData = JSON.parse(profileRaw)
      // console.log("parsedImage", profileCachedData)
      if (profileCachedData != null) {
        this.setState({ profilePhoto: profileCachedData.cachedProfileImage, cachedProfileEmail: profileCachedData.cachedProfileEmail })
      }
      // console.log("profilePhoto...............",{ profilePhoto: profileCachedData.cachedProfileImage, cachedProfileEmail: profileCachedData.cachedProfileEmail })
    } catch (error) {

    }
  } 

  componentDidMount = async () => {
    
    this.unsubscribe = this.props.navigation.addListener("tabPress", async e => {
      // Prevent default action
      await this.refreshData();
    });
    this.focusListener = this.props.navigation.addListener('focus', async e => {
      await this.refreshData();
    });
    AppState.addEventListener("change", this._handleAppStateChange);
    this.getProfile();
    await this.getRWalletBalance();
    // await this.getRWalletTransaction();
    this.setState({ emptyDataFlag: true })
    await this.getEWalletBalance();
    // await this.getSanatanMoneyTransaction()
    this.setState({ emptyDataFlag: true })
    this.getAddress();
  }

  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      await this.refreshData();
    }
    this.setState({ appState: nextAppState });
  };

  refreshData = async () => {
    try {
      await this.getAddress();
    } catch (ex) {
      // console.log("issue in home cdm", ex);
    } finally {
    }
  };

  componentWillUnmount() {
    // BackHandler.removeEventListener("hardwareBackPress", this.disableBackButton);
    try {
      if (this.unsubscribe && this.unsubscribe.remove) {
        this.unsubscribe.remove();
      }
      AppState.removeEventListener("change", this._handleAppStateChange);
      if (this.focusListener && this.focusListener.remove) {
        this.unsubscribe.remove();
      }
      AppState.removeEventListener("change", this._handleAppStateChange);
    } finally {

    }
  }

  selectAddress = async () => {
    this.props.navigation.navigate("MyAddress", { routeName: "Profile", callBack: this.refreshChosenAddress });
  };

  refreshChosenAddress = async () => {
    let Address = await getDefaultAddress();
    this.setState({
      DefaultAddress: Address.addressLine1,
    });
  }

  getAddress = async () => {
    let Address = await getDefaultAddress()
    this.setState({ DefaultAddress: Address.addressLine1});
  }

  getRWalletBalance = async () => {
    try {
      let response = await UserApi.getRWallet()
      // console.log("getRWalletBalance", response)
      if (response && response.balance) {
        this.setState({ rewardWallet: response.balance })
        AsyncStorage.setItem('RewardMoney', JSON.stringify(response.balance))
      } else {
      }
    } catch (error) {
      console.log(error)
    }
  }
  getEWalletBalance = async () => {
    try {
      let response = await UserApi.getEWallet()
      if (response && response.balance) {
        this.setState({ sanatanWallet: response.balance })
        AsyncStorage.setItem('SanatanMoney', JSON.stringify(response.balance))

      } else {

      }
    } catch (error) {
      console.log(error)
    }
  }

  getProfile = async () => {


    try {
      this.setState({ waitingLoaderVisible: true, isLoading: true })
      let response = await UserApi.getProfileData(this.props);
      // console.log("profile response", response)
      if (response && response !== null && response !== undefined) {
        this.setState({ waitingLoaderVisible: false, isLoading: false })
        this.setState({ profileResponse: response.user })
      }
      //   this.setState({ waitingLoaderVisible: false, isLoading: false })
      //   BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
    } catch (error) {
      console.log(error);
    }
  };


  // componentDidMount = async () => {
  //     // await this.fetchLiveLocation();
  // }


  _logout = async () => {
    await cleanStorage();
    this.props.navigation.replace('Login')
  }



  render() {

    const { selectedTheme } = this.state;
    const { profileResponse, rewardWallet, sanatanWallet,profilePhoto, cachedProfileEmail } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.primaryThemeColor }}>
        <ScrollView>
          <View style={{ height: hp(35), justifyContent: 'center', alignItems: 'center', marginTop: wp(2), backgroundColor: globalStyles.secondaryThemeColor }}>
          {(profilePhoto != undefined && profileResponse && cachedProfileEmail == profileResponse.email) ?
                <View>
                  {console.log(profilePhoto)}
                  <TouchableOpacity style={{ justifyContent: 'center', alignItems: "center" }} onPress={() => this.chooseProfilePhoto()}>
                    <Image
                      source={{ uri: profilePhoto }}
                      style={{ width: wp('40%'), height: wp('40%'), borderRadius: wp('50') }}
                    />
                    <View style={{ width: wp('11%'), height: wp('11%'), backgroundColor: "#284a83", borderRadius: 50, justifyContent: "center", alignItems: "center", position: "absolute", zIndex: 1 }}>
                      <EditIcon name={'edit'} size={20} color={'white'} />
                    </View>
                  </TouchableOpacity>
                </View>
                :
            <TouchableOpacity onPress={() => this.chooseProfilePhoto()}>
            <PersonIcon name={"user-circle-o"} color="gray" size={130} resizeMode="center" style={{ height: hp(20), width: wp(40), borderRadius: 150 }} />
            </TouchableOpacity>
  }
            {/* <View style={{backgroundColor:"#ffffff",height: hp(5), width: wp(10), borderRadius: 300,marginTop:-40,marginLeft:60}}>
              <TouchableOpacity>
                <Ionicons name={"pencil-outline"} color="gray" size={wp(5)} style={{justifyContent:"center",alignSelf:"center",marginTop:8}} />
              </TouchableOpacity>
            </View> */}
            <View style={{ alignItems: "center" }}>
              {(profileResponse && profileResponse.fullName) ? <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: wp(4) }}>{profileResponse.fullName}</Text> : null}
            </View>
            <View >
              {(profileResponse && profileResponse.phoneNumber) ? <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: wp(3) }}>{profileResponse.phoneNumber}</Text> : null}
            </View>
            <View >
              {(profileResponse && profileResponse.email) ? <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: wp(3) }}>{profileResponse.email}</Text> : null}
            </View>




          </View>

          <View style={{ height: hp(10), justifyContent: 'space-around', marginTop: wp(2), padding: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>

            <View style={{ flexDirection: 'row' }} >
              <Ionicons name={'person-outline'} color="gray" size={wp(4)} />
              <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(3) }}>Name</Text>
              <TouchableOpacity>
              <Ionicons name={"pencil-outline"} color="gray" size={wp(5)} style={{ color: 'gray', fontSize: wp(5), paddingLeft: wp(75) }}/>
              </TouchableOpacity>
            </View>
            <View >
              {(profileResponse && profileResponse.fullName) ? <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: wp(3), paddingLeft: wp(7) }}>{profileResponse.fullName}</Text> : null}
            </View>

          </View>


          <View style={{ height: hp(10), justifyContent: 'space-around', marginTop: wp(2), padding: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name={'call-outline'} color="gray" size={wp(4)} />
              <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(3) }}>Mobile no.</Text>
              <TouchableOpacity>
              <Ionicons name={"pencil-outline"} color="gray" size={wp(5)} style={{ color: 'gray', fontSize: wp(5), paddingLeft: wp(69) }}/>
              </TouchableOpacity>
            </View>
            <View >
              {(profileResponse && profileResponse.phoneNumber) ? <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: wp(3), paddingLeft: wp(7) }}>{profileResponse.phoneNumber}</Text> : null}
            </View>
          </View>
          <View style={{ height: hp(10), justifyContent: 'space-around', marginTop: wp(2), padding: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>
            <View style={{ flexDirection: 'row' }} >
              <Ionicons name={'mail-open-outline'} color="gray" size={wp(4)} />
              <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(3) }}>Email Address</Text>
            </View>
            <View >
              {(profileResponse && profileResponse.email) ? <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: wp(3), paddingLeft: wp(7) }}>{profileResponse.email}</Text> : null}
            </View>
          </View>


          <TouchableOpacity onPress={() => this.props.navigation.navigate("GiftWallet")}>
            <View style={{ height: hp(10), justifyContent: 'space-around', marginTop: wp(2), padding: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>

              <View style={{ flexDirection: 'row' }} >
                <RWalletIcon name={'wallet'} color="gray" size={wp(4)} />
                <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(3) }}>Gift Wallet</Text>
              </View>
              <View >
                {rewardWallet ? <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(7) }}>{`\u20B9 ${rewardWallet}`}</Text> : <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(7) }}>{`\u20B9 `}0</Text>}
              </View>

            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate("ReferenceBonus")}>
            <View style={{ height: hp(10), justifyContent: 'space-around', marginTop: wp(2), padding: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>

              <View style={{ flexDirection: 'row' }} >
                <EWalletIcon name={'wallet'} color="gray" size={wp(4)} />
                <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(3) }}>Reference Bonus</Text>
              </View>
              <View >
                {sanatanWallet ? <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(7) }}>{`\u20B9 ${sanatanWallet.toFixed(0)}`}</Text> : <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(7) }}>{`\u20B9 `}0</Text>}
              </View>

            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={async () => await this.selectAddress()}>
            <View style={{ height: hp(10), justifyContent: 'space-around', marginTop: wp(2), padding: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name={'home-outline'} color="gray" size={wp(4)} />
                <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(3) }}>Saved Address</Text>
              </View>
              <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: wp(3), paddingLeft: wp(7) }}>{this.state.DefaultAddress}</Text>
            </View>
          </TouchableOpacity>
          {/* <View style={{ height: hp(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: wp(2), padding: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name={'color-palette-outline'} color="gray" size={wp(4)} />
              <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(2) }}> Switch Theme</Text>
            </View>

            <Switch
              trackColor={{ false: "gray", true: "#cc5500" }}
              thumbColor={globalStyles.orangeThemeColor}
              ios_backgroundColor="#3e3e3e"
              value={selectedTheme == "dark" ? true : false}
            />
          </View> */}
          <TouchableOpacity activeOpacity={.9}
            onPress={() =>
              Alert.alert(
                'Log out',
                'Do you want to logout?',
                [
                  { text: 'Cancel', onPress: () => { return null } },
                  {
                    text: 'Confirm', onPress: () => {
                      this._logout();

                    }
                  },
                ],
                { cancelable: false }
              )
            }
          >
            <View style={{ height: hp(10), flexDirection: 'row', alignItems: 'center', marginTop: wp(2), padding: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>
              <Ionicons name={'power-outline'} color="gray" size={wp(4)} />
              <Text style={{ color: 'gray', fontSize: wp(3), paddingLeft: wp(2) }}>Logout</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  logoStyle: {
    height: wp('35%'),
    width: wp('97%'),
    alignSelf: 'center',
    borderRadius: 3,
    // elevation: 10
  },
});
