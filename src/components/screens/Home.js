import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  AppState,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
} from "react-native";
import Swiper from "react-native-swiper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Rating, AirbnbRating } from "react-native-ratings";
import Geolocation from "@react-native-community/geolocation";
import BaseURL from "../../services/BaseURL";
import ServiceURL from "../../services/ServiceURL";
import RequestMethod from "../../services/RequestMethod";
import Geocoder from "react-native-geocoding";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { globalStyles } from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserApi from "../../services/UserApi";
import { getCategories, getMenuCategories } from "../../services/business/categories";
import { getSystemSettings } from "../../services/business/systemSettings";
import { getNearByVendors } from "../../services/business/vendors";
import { getSliders } from "../../services/business/sliders";
import ProductWidget from "../containers/productWidget";
import { getProductWidgets } from "../../services/business/product";
import ProductBox from "../containers/productBox";
import Loader from "../containers/loader";
import Feather from "react-native-vector-icons/Feather";
import { getTotalCartItemCount } from "../../services/business/cart";
import { getDefaultAddress } from "../../services/business/address";

let currentCount = 0;
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveLocation: "",
      address: [],
      myAddress: "",
      categories: [],
      isLoading: false,
      nearByVendors: [],
      widgetData: [],
      slides: [],
      settings: {},
      cartQuantity: 0,
      appState: AppState.currentState,
      currentCount : 0,
    };

    console.log("address parameters received are " + props.route.params);

    this.unsubscribe = null;
    this.focusListener = null;
  }

  _handleAppStateChange = async (nextAppState) => {
    console.log("Home screen is active now");
    if (
      // this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("Home screen is active now");
      await this.refreshData();
    }
    this.setState({ appState: nextAppState });
  };

  refreshData = async () => {
    try {
      let cartCount = await getTotalCartItemCount();
      this.setState({
        cartQuantity: " " + cartCount,
      });

      await this.getAddress();
    } catch (ex) {
      console.log("issue in home cdm", ex);
    } finally {
    }
  };

  // and don't forget to remove the listener
  componentWillUnmount() {
    // BackHandler.removeEventListener("hardwareBackPress", this.disableBackButton);
    try {
      if (this.unsubscribe && this.unsubscribe.remove) {
        this.unsubscribe.remove();
      }
    } finally {

    }
  }

  // disableBackButton = () => {
  //   if (currentCount < 1) {
  //     currentCount += 1;
  //     ToastAndroid.show("Press again to exit", ToastAndroid.SHORT);
  //   } else {
  //     BackHandler.exitApp();
  //   }
  //   setTimeout(() => {
  //     currentCount = 0;
  //   }, 2000);
  //   return true;
  // };
  componentDidMount = async () => {
    const {cartCounter } = this.state;
    // BackHandler.addEventListener("hardwareBackPress", this.disableBackButton);
    this.unsubscribe = this.props.navigation.addListener("tabPress", async e => {
      // Prevent default action
      await this.refreshData();
    });

    this.focusListener = this.props.navigation.addListener('focus', async e => {
      await this.refreshData();
    });

    this.setState({
      isLoading: true,
    });
    try {
      AppState.addEventListener("change", this._handleAppStateChange);
      await this.fetchLiveLocation();
      let categories = await getMenuCategories();
      let settings = await getSystemSettings();
      await this.getAddress();
      let lat = this.state.address ? this.state.address.latitude : 26.6576;
      let lng = this.state.address ? this.state.address.longitude : 75.7653;
      let vendors = await getNearByVendors(lat, lng);
      let slides = await getSliders();
      let widgetData = await getProductWidgets();
      let cartCount = await getTotalCartItemCount();
      this.setState({
        categories: categories,
        settings: settings,
        nearByVendors: vendors,
        widgetData: widgetData,
        slides: slides,
        cartQuantity: cartCount,
      });

    } catch (ex) {
      console.log("issue in home cdm", ex);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  getAddress = async () => {
    try {
      let response = await getDefaultAddress();
      console.log("address ", response);
      if (response) {
        this.setState({ address: response });
        let address = " " + response.contactName + " ";
        this.setState({ myAddress: address });
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  fetchLiveLocation = async () => {
    let latitude = "";
    let longitude = "";
    await Geolocation.getCurrentPosition(info => {
      // console.log("Your current location is == ", info);
      latitude = info.coords.latitude;
      longitude = info.coords.longitude;
      // console.log("lat == ", latitude, "   longitude == ", longitude);
      Geocoder.init(BaseURL.GOOGLE_API_KEY); // use a valid API key
      Geocoder.from(latitude, longitude)
        .then(json => {
          var location = json.results[0].formatted_address;
          this.setState({ liveLocation: location });
          // console.log("live location JSON data  == ", json);
          // console.log("real location = ", location);
        })
        // .catch(error => console.warn("Some error occured  = ", error));
    });


  };

  renderItem = (item) => {
    return (
      <View style={{
        height: wp(28),
        width: wp(22),
        borderRadius: 8,
        backgroundColor: globalStyles.secondaryThemeColor,
        alignItems: "center",
      }}>
        <TouchableOpacity key={item}>
          <View style={{ justifyContent: "center", marginTop: wp(2.7) }}>
            <Image source={{ uri: item.thumbnailImageUrl }}
              style={{ height: wp(21), width: wp(18), borderRadius: 8 }} />
            <Text
              style={{ fontSize: wp(2.5), textAlign: "center", color: "white",  }}>{item.name} </Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  };
  nearByRestaurants = (item) => {
    return (
      <View style={{
        height: wp(32),
        width: wp(22),
        borderRadius: 6,
        backgroundColor: globalStyles.secondaryThemeColor,
        alignItems: "center",
      }}>
        <TouchableOpacity key={item} onPress={() => this.props.navigation.navigate("Restaurant", { Item: item })}>
          <View style={{ marginTop: wp(2.7), alignItems: "center" }}>
            <Image source={item.source ? item.source : { uri: item.thumbnailImageUrl }}
              style={{ height: wp(21), width: wp(18), borderRadius: 6 }} />
            <Text
              style={{ fontSize: wp(2.4), textAlign: "center", color: "white" }}>{item.name} </Text>
            {/* <Text style={{ fontSize: 11, color: 'gray', fontWeight: 'bold' }}>{item.address} </Text> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  storesView = (item) => {
    return (
      <View style={{ width: wp("85%"), backgroundColor: globalStyles.secondaryThemeColor, borderRadius: 8 }}>
        <TouchableOpacity key={item} onPress={() => this.props.navigation.navigate("Restaurant", { Item: item })}>
          <View style={{ alignItems: "center", marginTop: wp("3%") }}>
            <Image source={item.source ? item.source : { uri: item.thumbnailImageUrl }}
              style={{ height: hp(25), width: wp("79%"), borderRadius: 8 }} />
            <View style={{ width: wp("80%") }}>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <Text style={{ fontSize: wp(3), color: "white",  }}>{item.name} </Text>
                <Text style={{ fontSize: wp(2.5), color: "gray", }}>{item.description} </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", borderRadius: 8 }}>
                <AirbnbRating
                  count={5}
                  showRating={false}
                  reviews={["Terrible", "Bad", "Good", "Very Good", "Amazing"]}
                  selectedColor="#f06755"
                  defaultRating={4}
                  size={wp(3.5)}
                />
                <View style={{ flexDirection: "row", margin: wp(2) }}>
                  <View style={{
                    flexDirection: "row",
                    height: hp(2.4),
                    width: wp(15),
                    justifyContent: "center",
                    borderColor: "#f06755",
                    borderWidth: 1,
                    borderRadius: 9,
                    marginRight: wp(2),
                  }}>
                    <Ionicons name={"location-outline"} color="#f06755" size={wp(3)} />
                    <Text style={{ fontSize: wp(2.7),  color: "white" }}> {item.distance} Km </Text>
                  </View>
                  <View style={{
                    flexDirection: "row",
                    height: hp(2.4),
                    width: wp(12),
                    justifyContent: "center",
                    borderColor: "#f06755",
                    borderWidth: 1,
                    borderRadius: 9,
                  }}>
                    <Ionicons name={"time-outline"} color="#f06755" size={wp(3)} />
                    <Text style={{ fontSize: wp(2.7), color: "white" }}> 90' </Text>
                  </View>
                </View>
                {/* <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'white' }}>4.6 Km</Text> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };


  renderSeparator = () => {
    return (
      <View
        style={{
          width: wp(1.8),
          backgroundColor: globalStyles.primaryThemeColor,
        }}
      />
    );
  };

  render() {

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.secondaryThemeColor, alignItems: "center" }}>
        <StatusBar animated={true} backgroundColor={globalStyles.primaryThemeColor} />
        {/* this.props.navigation.navigate('MyAddress') */}
        <View key={"nokey"} style={{
          flexDirection: "row",
          height: wp(13),
          backgroundColor: globalStyles.secondaryThemeColor,
        }}>
          <View style={{ flex: 0.2, alignItems: "center", flexDirection: "row" }}>
            <Image
              style={{ height: wp(5), width: wp(20) }}
              source={require("../../assets/foodicon.png")}
            />
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("MyAddress")}
            style={{ flex: 0.5, alignItems: "center", flexDirection: "row" }}>
            <Ionicons name={"location-outline"} color="#f06755" size={wp(5)} />

            <Text style={{  color: "white" }}>{this.state.myAddress}</Text>
            <Ionicons name={"create"}
              color="#f06755"
              size={wp(5)} />
          </TouchableOpacity>
          <View style={{ flex: 0.2, justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity  onPress={() => this.props.navigation.navigate("Cart")} style={{ flexDirection: "row" }}>
              <Feather name={"shopping-cart"} color={globalStyles.orangeThemeColor} size={wp(4.5)} />
            </TouchableOpacity>
            <Text style={{
              flexDirection: "row",
              color: "white",
            }}> {this.state.cartQuantity} </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => this.props.navigation.navigate("Search")}>
          <View style={{
            flexDirection: "row",
            height: hp(7),
            marginBottom: wp(2),
            width: wp("97%"),
            alignItems: "center",
            backgroundColor: globalStyles.primaryThemeColor,
            borderRadius: 15,
          }}>
            <Ionicons name={"search-outline"} style={{ paddingLeft: wp(2) }} size={wp(4.4)} color={"white"} />
            <Text style={{ color: "white" }}> Find what you love :)</Text>
          </View>
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: globalStyles.primaryThemeColor }}>
            {/* <Text style={{ fontSize: wp(4), fontWeight: 'bold', fontFamily: 'AkayaTelivigala-Regular',color:'white' }}>Popular Categories</Text> */}
            <FlatList
              style={{ marginTop: wp(2) }}
              data={this.state.categories}
              keyExtractor={(item, index) => item.name}
              renderItem={({ item, index }) => this.renderItem(item, index)}
              ItemSeparatorComponent={this.renderSeparator}
              // keyExtractor={(item, index) => `post__${index}`}
              showsHorizontalScrollIndicator={false}
              horizontal
            // pagingEnabled={true}

            />
          </View>
          {this.state.settings.IsMultiVendorApp == "true" &&
            <View style={{ paddingTop: wp(2), backgroundColor: globalStyles.primaryThemeColor }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: wp(2) }}>
                <Text style={{ fontSize: wp(4), color: "white" }}>Popular near you</Text>
                <TouchableOpacity key={"nearVendors"}><Text
                  style={{ fontSize: wp(3.4), color: globalStyles.orangeThemeColor }}
                  onPress={() => this.props.navigation.navigate("Near by vendors", this.state.nearByVendors)}>See
                all</Text></TouchableOpacity>
              </View>
              <FlatList
                style={{ marginTop: wp(2) }}
                keyExtractor={(item, index) => item.name}
                data={this.state.nearByVendors}
                renderItem={({ item, index }) => this.storesView(item, index)}
                ItemSeparatorComponent={this.renderSeparator}
                // keyExtractor={(item, index) => `post__${index}`}
                showsHorizontalScrollIndicator={false}
                horizontal
              // pagingEnabled={true}

              />
            </View>}
          <View style={{ height: hp(25), paddingTop: wp(2), backgroundColor: globalStyles.primaryThemeColor }}>
            <Text style={{ fontSize: wp(4),  color: "white", paddingLeft: wp(2) }}>Best Deals</Text>
            <Swiper style={{ elevation: 5, marginTop: wp(3) }}
              autoplay
              autoplayDelay={3}
              autoplayLoop
              index={2}
              showPagination
              activeDotColor={"#dddddd"}
              dotColor={"#dddddd"}

            >
              {
                this.state.slides.map((item, index) => {
                  return (
                    <View style={{}}>
                      <TouchableOpacity key={item}>
                        <Image source={{ uri: item.image }}
                          style={styles.logoStyle}
                          resizeMethod="resize"
                          resizeMode="stretch"
                        />
                      </TouchableOpacity>
                    </View>
                  );
                },
                )
              }

            </Swiper>
          </View>
          <View style={{ backgroundColor: globalStyles.primaryThemeColor }}>
            <Text style={{ fontSize: wp(4), color: "white", marginTop: wp(2), paddingLeft: wp(2) }}>Restaurants
              near me </Text>
            <FlatList
              style={{ marginTop: wp(2) }}
              data={this.state.nearByVendors}
              keyExtractor={(item, index) => item.name}
              renderItem={({ item, index }) => this.nearByRestaurants(item, index)}
              ItemSeparatorComponent={this.renderSeparator}
              // keyExtractor={(item, index) => `post__${index}`}
              showsHorizontalScrollIndicator={false}
              horizontal
            // pagingEnabled={true}

            />
          </View>
          {this.state.widgetData.length > 0 &&
            <ProductWidget
              widgetData={this.state.widgetData}
              navigation={this.props.navigation}
            />
          }
          {
            this.state.isLoading &&
            <Loader visible={this.state.isLoading} isLoading={this.state.isLoading} />
          }
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  logoStyle: {
    height: wp("35%"),
    width: wp("97%"),
    alignSelf: "center",
    borderRadius: 3,
    // elevation: 10
  },
});
