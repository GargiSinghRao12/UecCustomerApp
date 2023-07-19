import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  // ScrollView,
  TextInput,
  StatusBar,
  AppState,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { globalStyles as globalStyle, globalStyles } from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import Rupee from "react-native-vector-icons/FontAwesome";
import RBSheet from "react-native-raw-bottom-sheet";
import Slider from "react-native-fluid-slider";
import { getSystemSettings } from "../../services/business/systemSettings";
import { getDefaultAddress } from "../../services/business/address";
import { searchItem } from "../../services/business/search";
import { ActivityIndicator } from "react-native-paper";
import { simpleToast } from "../../services/utility/toastMessage";
import ClockIcon from "react-native-vector-icons/EvilIcons";
import Tools from "../../../src/components/screens/Tools";
// import Slider from "react-native-fluid-slider";
import ProductCatalog from "../../../src/components/screens/ProductCatalog";
import { ScrollView } from "react-native-gesture-handler";
import { clearCart, getCartItems, getTotalCartItemCount, increaseProductIntoCart } from "../../services/business/cart";
import FilterTest from "./FilterTest";
import { getCategories } from "../../services/business/categories";

let filterKeys = {
  category: 0,
  dish: "2",
  store: "3",
  price: "4",
};

let searchMethods = {
  product: "product",
  store: "store",
};

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 2000,
      isSelected: 2,
      isSelected1: 0,
      liveLocation: "",
      AddressData: [],
      searchOptions: {
        pageSize: 20,
        page: 1,
        category: "all",
      },
      searchText: "",
      address: {},
      searchType: searchMethods.product,
      categories: [],
      isLoading: false,
      filterHeader: [],
      searchResult: {},
      slides: [],
      loading: false,
      settings: {},
      cartQuantity: 0,
      products: [],
      vendors: [],
      appState: AppState.currentState,
      cart: {},
      cartCounter: 0,
    };
    this.unsubscribe = null;
    this.focusListener = null;
  }

  componentDidMount = async () => {

    this.unsubscribe = this.props.navigation.addListener("tabPress", async e => {
      // Prevent default action
      await this.refreshData();
    });
    this.focusListener = this.props.navigation.addListener("focus", async e => {
      await this.refreshData();
    });
    console.log("Value of this.props", this.props);
    if (this.props.route.params) {
      let Filters = this.props.route.params.Item;
      await this.onFilterTextChange(Filters);
    }

    let categories = await getCategories();

    this.setState({
      allCategories: categories
    });

    let settings = await getSystemSettings(false);
    let data = [];
    if (settings.IsMultiVendorApp) {
      data = [{ key: filterKeys.category, name: "Filter" },
        { key: filterKeys.dish, name: settings.IsFoodAppView == "true" ? "Dishes" : "Products" },
        { key: filterKeys.store, name: settings.IsFoodAppView == "true" ? "Restaurants" : "Store" },
        { key: filterKeys.price, name: "Price" }];
    } else {
      data = [{ key: filterKeys.category, name: "Filter" },
        { key: filterKeys.dish, name: settings.IsFoodAppView == "true" ? "Dishes" : "View Products" },
        { key: filterKeys.price, name: "Price" }];
    }

    let address = await getDefaultAddress();
    try {
      await this.setCart();
    } catch (error) {
      console.log("here is the error................................", error);
    }
    console.log("Set Cart Data.............................");
    this.setState({
      filterHeader: data,
      address: address,
    });
  };

  refreshData = async () => {
    const { searchText, searchResult, cartCounter } = this.state;
    try {
      let cartData = await getCartItems();
      let count = await getTotalCartItemCount(cartData);
      if (cartData != null) {
        this.setState({
          cart: cartData,
          cartCounter: count,
        });
      }
      console.log("Card Counter Value ........................", cartCounter);
    } catch (ex) {
      console.log("issue in home cdm", ex);
    } finally {
    }
  };

  // selectAddress = async () => {
  //   this.props.navigation.navigate("FilterTest",{ routeName: "Search", callBack: this.refreshChosenAddress });
  //   // console.warn("We are testing....",this.props);
  // };

  selectAddress = async () => {
    this.props.navigation.navigate("FilterTest");
    // console.warn("We are testing....",this.props);
  };

  // refreshChosenAddress = async () => {
  //   console.warn("Hii Gargi...")
  //   let Address = await getDefaultAddress();
  //   this.setState({
  //     DefaultAddress: Address.addressLine1,
  //   });
  // }

  onHeaderClick = async (item) => {

    console.log("selected view is " + item);
    this.setState({
      isSelected: item.key,
      setVisible: true,
    });

    if (item.key == filterKeys.store) {
      this.setState({
        searchType: searchMethods.store,
      });
      await this.onSearchTextChange(this.state.searchText);
    }
    if (item.key == filterKeys.dish) {
      this.setState({
        searchType: searchMethods.product,
      });
      await this.onSearchTextChange(this.state.searchText);
    }

    if (item.key == filterKeys.category) {
      this.RBSheet.open();
    }
  };

  onSearchTextChange = async (text) => {
    // console.log("Searched...................................................", text);
    let searchOptions = this.state.searchOptions;
    let address = this.state.address;
    this.setState({
      searchText: text,
      loading: true,
    });

    if (text.length < 0) return;
    // console.log("now we are going to search ");
    searchOptions.page = 1;
    searchOptions.pageSize = 20;
    searchOptions.query = text;

    //list of category -> selected -> catgList forEach(x=> categoryList = catgeoryList + "--" + x.slug)
    //category ->  searchOptions.category = category.slug--pizza--idli--samosa
    // searchOptions.maxPrice = value of slider (if user manually set the price)
    //price

    console.log("search options ", searchOptions);
    let result = await searchItem(this.state.searchType, searchOptions, address.latitude, address.longitude);
    console.log("Result Value..............", result);
    if (result && (result.products.length > 0 || result.vendors.length > 0)) {
      console.log("vendors  ", result.vendors);
      this.setState({
        searchResult: result,
        products: result.products,
        vendors: result.vendors ? result.vendors : [],
        loading: true,
      });
    }

    this.setState({
      loading: false,
    });
  };

  clearFilter= async()=>{

  }


  onFilterTextChange = async (Item) => {
    this.setState({
      loading: true
    });
    console.log("Filter Searched...................................................", Item);
    let searchOptions = this.state.searchOptions;
    let address = this.state.address;

    console.log("now we are going to search ");
    searchOptions.page = 1;
    searchOptions.pageSize = 20;
    searchOptions.category = Item.category;
    searchOptions.maxPrice = Item.max_price;

    if(searchOptions.maxPrice == 0){
      delete searchOptions.maxPrice;
    }

    this.setState({
      searchOptions: searchOptions
    });

    console.log("search options ", searchOptions);
    let result = await searchItem(this.state.searchType, searchOptions, address.latitude, address.longitude);
    // if (result && (result.products.length > 0 || result.vendors.length > 0)) {
    if (result) {
      console.log("vendors/products ", result);
      this.setState({
        searchResult: result,
        products: result.products,
        vendors: result.vendors ? result.vendors : [],
        isSelected: filterKeys.dish,
        loading: false,
      });
    }

    this.RBSheet.close();

    this.setState({
      loading: false
    });
  };


  handleMoreVendors = async () => {
    console.log(" loading more ");
    try {
      let { searchOptions, searchResult, address, vendors } = this.state;
      this.setState({
        loading: true,
      });

      let currentVendorsCount = this.state.vendors.length;
      if (currentVendorsCount >= searchResult.totalProduct) {
        if (this.state.searchOptions.page != 1) {
          simpleToast("No more vendors");
        }
        this.setState({
          loading: false,
        });
        return;

      }

      let pageNumber = searchOptions.page + 1;
      searchOptions.page = pageNumber;
      this.setState({
        searchOptions: searchOptions,
      });

      let result = await searchItem(this.state.searchType, searchOptions, address.latitude, address.longitude);
      if (result && result.vendors && result.vendors.length > 0) {
        // let moreProducts = Array.prototype.push(products, result.products)
        let moreVendors = [...vendors, ...result.vendors];
        this.setState({
          vendors: moreVendors,
          searchResult: result,
          loading: false,
        });
      }
    } catch (ex) {
      // console.log("search more exception ", ex);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  handleMoreProducts = async () => {
    console.log(" loading more ");
    try {
      let { searchOptions, searchResult, address, products } = this.state;
      this.setState({
        loading: true,
      });

      let currentProductsCount = this.state.products.length;
      if (currentProductsCount >= searchResult.totalProduct) {
        if (this.state.searchOptions.page != 1) {
          simpleToast("No more products");
        }
        this.setState({
          loading: false,
        });
        return;

      }

      let pageNumber = searchOptions.page + 1;
      searchOptions.page = pageNumber;
      this.setState({
        searchOptions: searchOptions,
      });

      console.log("search options ", searchOptions);

      let result = await searchItem(this.state.searchType, searchOptions, address.latitude, address.longitude);
      if (result && result.products && result.products.length > 0) {
        // let moreProducts = Array.prototype.push(products, result.products)
        let moreProducts = [...products, ...result.products];
        this.setState({
          products: moreProducts,
          searchResult: result,
          loading: false,
        });
      }
    } catch (ex) {
      // console.log("search more exception ", ex);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  loadProduct = async (item) => {
    this.props.navigation.navigate("Product Description", { productId: item.id });
  };

  setCart = async () => {
    const { searchText, searchResult, cartCounter } = this.state;
    let cartData = await getCartItems();
    let count = await getTotalCartItemCount(cartData);
    if (cartData != null) {
      this.setState({
        cart: cartData,
        cartCounter: count,
      });
    }
    console.log("Card Counter Value ........................", cartCounter);
  };

  Restaurants = () => {
    const { vendors } = this.state;
    return (
      <FlatList
        data={vendors}
        onEndReached={async () => await this.handleMoreVendors()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return (
            <View>
              <ActivityIndicator animating={this.state.loading} size="large" color={globalStyles.orangeThemeColor} />
            </View>
          );
        }}
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Restaurant", { Item: item })}
                            style={{ flex: 1, backgroundColor: (globalStyles.secondaryThemeColor) }}>
            <View style={{
              height: wp("38%"),
              width: "100%",
              backgroundColor: (globalStyles.primaryThemeColor),
              marginTop: 10,
              flexDirection: "row",
            }}>
              <View style={{ flex: 0.4, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Image source={{ uri: item.thumbnailImageUrl }} style={{
                  position: "absolute",
                  height: 100,
                  width: 110,
                  margin: 10,
                  borderRadius: 15,
                  alignSelf: "center",
                }} />
                <View style={{
                  alignItems: "center",
                  height: 25,
                  width: 80,
                  backgroundColor: "white",
                  borderRadius: 10,
                  marginTop: 90,
                  justifyContent: "center",
                  flexDirection: "row",
                }}>
                  <Text style={{ color: "green", textAlign: "center", fontSize: 15 }}>{item.off}%
                    OFF</Text>
                </View>
              </View>
              <View style={{ flex: 0.7, flexDirection: "column", justifyContent: "center" }}>
                <View style={{ flexDirection: "column", flex: 0.75, justifyContent: "center" }}>
                  <Text style={{ color: "white", fontSize: 15, margin: 5 }}>{item.name}</Text>
                  <Text style={{ color: "grey", fontSize: 15 }}>{item.description}</Text>
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 15,
                    }}>{item.plainAddress} | {" " + item.distance.toFixed() + " kms"}</Text>
                  <Text style={{ color: "white", fontSize: 15, marginTop: 10 }}>
                    <Material name={"star"} size={20} color={globalStyles.orangeThemeColor} />
                    {item.vendorRating} |
                    {" " + item.deliveryTime} | {" "}
                    <Rupee name={"rupee"} size={13} color={globalStyles.orangeThemeColor} />
                    {item.expenseOfTwo} for two</Text>
                </View>
                <View style={{ flex: 0.25, flexDirection: "row", alignItems: "center" }}>
                  <View style={{
                    height: "60%",
                    width: "60%",
                    borderColor: "white",
                    borderWidth: 0.5,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Text style={{ color: "white", fontSize: 15 }}><Material name={"brightness-percent"} size={18}
                                                                             color={globalStyles.orangeThemeColor} /> 50%
                      off upto <Rupee name={"rupee"} size={15} color={"white"} />150</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        }
      />
    );
  };

  Dishes = () => {
    const { products } = this.state;
    return (
      <FlatList
        data={products}
        renderItem={({ item }) =>
          <View style={{ flex: 1, backgroundColor: (globalStyles.secondaryThemeColor) }}>
            <View style={{
              height: wp("32"),
              width: wp("100"),
              backgroundColor: (globalStyles.primaryThemeColor),
              marginTop: wp(1),
              flexDirection: "column",
            }}>
              <View style={{ height: "40%", width: wp("95"), alignSelf: "center", flexDirection: "row" }}>
                <View style={{ flex: 0.7, flexDirection: "column", justifyContent: "center" }}>
                  <View style={{ flexDirection: "row", marginTop: wp("1") }}>
                    <Material name={"checkbox-intermediate"} size={10} color={"green"} />
                    <Text style={{ color: globalStyles.orangeThemeColor, fontSize: 10 }}>
                      <Material name={"star"} size={10} color={globalStyles.orangeThemeColor} /> BESTSELLER</Text>
                  </View>
                  <Text style={{ color: "white", fontSize: 10 }}>{item.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                    <Text style={{ color: "grey", fontSize: 10 }}>{item.calculatedProductPrice.priceString}</Text>
                  </View>
                </View>
                <View style={{ flex: 0.3, flexDirection: "column", alignItems: "center" }}>
                  <Image source={{ uri: item.thumbnailUrl }} style={{
                    position: "absolute",
                    height: wp("24"),
                    width: wp("24"),
                    margin: wp("2"),
                    borderRadius: 15,
                    alignSelf: "center",
                  }} />
                  <TouchableOpacity
                    onPress={async () => await this.loadProduct(item)}
                    style={{
                      position: "absolute",
                      alignItems: "center",
                      height: wp("6"),
                      width: wp("15"),
                      backgroundColor: "white",
                      borderRadius: wp("2"),
                      marginTop: wp("22"),
                      justifyContent: "center",
                      flexDirection: "row",
                    }}>
                    <Material name={"plus-thick"} size={15} color={"green"} />
                    <Text style={{ color: "green", textAlign: "center", fontSize: 12 }}>ADD</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{
                width: "35%",
                height: "1%",
                backgroundColor: (globalStyles.secondaryThemeColor),
                marginTop: 18,
              }} />
              <View style={{ height: "25%", width: "95%", alignSelf: "center", flexDirection: "row" }}>
                <View style={{ flex: 0.7, flexDirection: "column" }}>
                  <Text style={{ color: "white", fontSize: 10 }}>{item.vendorName}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: 10 }}>
                      <Material name={"star"} size={15} color={globalStyles.orangeThemeColor} /> {"4.5 "}
                      <ClockIcon name={"clock"} color={globalStyle.orangeThemeColor} size={15} /> {item.deliveryTime}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        }
        onEndReached={async () => await this.handleMoreProducts()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return (
            <View>
              <ActivityIndicator animating={this.state.loading} size="large" color={globalStyles.orangeThemeColor} />
            </View>
          );
        }}
      />
    );
  };

  Close = () => {
    this.RBSheet.close();
    this.setState({ isSelected: 1 });
  };


  render() {
    const { searchText, allCategories, searchResult, cartCounter } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: globalStyles.secondaryThemeColor, flexDirection: "column" }}>
        <View key={"nokey"} style={{
          flexDirection: "row",
          height: wp(13),
          padding: 10,
          backgroundColor: globalStyles.secondaryThemeColor,
          justifyContent: "space-between",
        }}>
          <View style={{ flex: 0.2, alignItems: "center", flexDirection: "row" }}>
            <Image
              style={{ height: wp(5), width: wp(20) }}
              source={require("../../assets/foodicon.png")}
            />
          </View>
          <Text style={{ color: (globalStyles.orangeThemeColor), fontSize: 25 }}>Search</Text>
          <View style={{ flex: 0.2, justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.props.navigation.navigate("Cart")}>
              <Feather name={"shopping-cart"} color={globalStyles.orangeThemeColor} size={wp(4.5)} />
            </TouchableOpacity>
            <Text style={{
              flexDirection: "row",
              color: globalStyles.orangeThemeColor,
            }}>{" " + this.state.cartCounter} </Text>
          </View>
        </View>
        <View style={{
          flexDirection: "row",
          height: hp(7),
          marginBottom: wp(1),
          width: wp("97%"),
          alignItems: "center",
          backgroundColor: globalStyles.primaryThemeColor,
          borderRadius: 15,
          alignSelf: "center",

        }}>
          <Ionicons name={"search-outline"} style={{ paddingLeft: wp(2) }} size={wp(4.4)} color={"white"} />
          <TextInput
            placeholder="  Find what you love :)"
            color={"white"}
            placeholderTextColor="white"
            searchText={searchText}
            onChangeText={async (value) => await this.onSearchTextChange(value)}
            style={{}}
          />
          <View style={[styles.separator]} />

          <TouchableOpacity onPress={async () => await this.onHeaderClick({key: filterKeys.category})}>
            <Image
              source={require("../../assets/filter.png")}
              style={[
                styles.icon,
                // { tintColor: haveFilter ? Color.primary : text },
              ]}
            />
            {/* <Ionicons name={"search-outline"} style={{ paddingLeft: wp(2) }} size={wp(4.4)} color={"white"} /> */}
          </TouchableOpacity>
        </View>
        <View style={{
          flexDirection: "row",
          height: hp(8),
          marginBottom: wp(2),
          width: wp("100%"),
          alignItems: "center",
          backgroundColor: globalStyles.secondaryThemeColor,
          alignSelf: "center",
        }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={this.state.filterHeader}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={() => this.onHeaderClick(item)}>
                <View style={{
                  height: hp("5%"),
                  width: wp("28%"),
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: this.state.isSelected == item.key ? "white" : globalStyles.orangeThemeColor,
                  margin: 10,
                  backgroundColor: globalStyles.primaryThemeColor,
                }}>
                  <Text style={{
                    alignSelf: "center",
                    padding: 5,
                    color: this.state.isSelected == item.key ? "white" : globalStyles.orangeThemeColor,
                  }}>{item.name} <AntDesign name={this.state.isSelected == item.key ? "caretup" : "caretdown"}
                                            color={this.state.isSelected == item.key ? "white" : globalStyles.orangeThemeColor}
                                            size={wp(3)} /> </Text>
                </View>
              </TouchableOpacity>
            }

          />
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            closeOnDragDown={true}
            animationType="slide"
            height={hp(80)}
            openDuration={250}
            customStyles={{}}
          >
            <FilterTest
              bottomSheet={this.RBSheet}
              searchWithFilter={this.onFilterTextChange}
              clearFilter={this.clearFilter}
              categories={allCategories}
            >

            </FilterTest>
          </RBSheet>
        </View>


        <View style={{ height: 2, width: "100%", backgroundColor: (globalStyles.primaryThemeColor) }}></View>
        {this.state.isSelected == 0 &&

        this.RBSheet.open()
        }
        {this.state.isSelected == filterKeys.store &&

        this.Restaurants()
        }
        {this.state.isSelected == filterKeys.dish &&
        this.Dishes()
        }
        {this.state.isSelected == filterKeys.price &&

        this.Dishes()
        }
      </View>
    );
  }

}
const styles = StyleSheet.create({
  bottomNavigationView: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    height: 400,
    alignItems: "center",
  },
  container: {
    flex: 0.35,
    justifyContent: "center",
    width: "90%",

  },
  sliderContainer: {
    width: "100%",
  },
  valueText: {
    fontSize: 40,
    textAlign: "center",
    color: "#3FC1BE",
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
    margin: 10,
  },
  separator: {
    width: 0.5,
    height: 20,
    backgroundColor: "#ccc",
    marginLeft: 130,
  },
});
