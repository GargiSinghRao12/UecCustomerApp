import React, { Component, PureComponent } from "react";
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
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-swiper";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { globalStyles } from "../styles/globalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Rating } from "react-native-ratings";
import * as Animatable from "react-native-animatable";
import { getProductDetail } from "../../services/business/product";
import {
  addProductIntoCart, decreaseProductFromCart,
  getCartItems,
  increaseProductIntoCart,
  isProductInCart,
} from "../../services/business/cart";


export default class ProductDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSelected:false,
      productId: props.productId,
      productDetail: props.productDetail ? props.productDetail : "",
      priceData: {},
      selectedVariant: null,
      sliderImages: [],
      allowChangeVariant: true,
      isProductAlreadyInCart: false,
      cartQuantity: 0,
      isCartLoading: false,
    };
  }

  setCartLoading = (isLoading) => {
    this.setState({
      isCartLoading: isLoading,
    });
  };

  componentDidMount = async () => {
    let productDetail = await getProductDetail(this.state.productId);
    this.setState({
      productDetail: productDetail,
      sliderImages: productDetail.images,
      priceData: productDetail.calculatedProductPrice,
    });

    let variantIds = [];
    if (productDetail.variations && productDetail.variations.length > 0) {
      await this.selectVariant(productDetail.variations[0]);
      variantIds = productDetail.variations.map(item => item.id);
    }

    //check if product already exist in cart
    let cartData = await getCartItems();
    console.log("cart data ", cartData);
    let alreadyInCart = isProductInCart(productDetail.id, variantIds, cartData);
    if (alreadyInCart != null) {
      this.setState({
        isProductAlreadyInCart: true,
        allowChangeVariant: false,
        cartQuantity: alreadyInCart.quantity,
      });
    }
    // console.log("product detail ", productDetail);
  };

  selectVariant = async (variant) => {
    if (!this.state.allowChangeVariant) return;

    this.setState({
      selectedVariant: variant,
      priceData: variant.calculatedProductPrice,
    });

    //TODO: open bottom sheet if options available - for later
  };

  incrementCartItem = async () => {
    try {
      this.setCartLoading(true);
      let product = this.state.selectedVariant != null ? this.state.selectedVariant : this.state.productDetail;
      if (!product.stockTrackingIsEnabled || product.stockQuantity > 0) {
        await increaseProductIntoCart(product);
        this.setState({
          isProductAlreadyInCart: true,
          allowChangeVariant: false,
          cartQuantity: this.state.cartQuantity + 1,
        });
      } else {
        alert("You can not add more");
      }
    } catch (ex) {
      //TODO: bottom sheet message
      // console.log("error in adding into cart ", ex);
      alert("Unable to add product in cart");
    } finally {
      this.setCartLoading(false);
    }
  };

  decreaseCartItem = async () => {
    try {
      this.setCartLoading(true);
      let product = this.state.selectedVariant != null ? this.state.selectedVariant : this.state.productDetail;
      let result = await decreaseProductFromCart(product);
      if (result.code == "decreased") {
        this.setState({
          cartQuantity: this.state.cartQuantity - 1,
        });
      } else if (result.code == "removed") {
        this.setState({
          cartQuantity: 0,
          isProductAlreadyInCart: false,
          allowChangeVariant: true,
        });
      } else {
        console.log(result);
      }
    } finally {
      this.setCartLoading(false);
    }
  };

  addToCart = async () => {
    try {
      this.setCartLoading(true);
      const { selectedVariant, productDetail } = this.state;
      let data = await addProductIntoCart(selectedVariant != null ? selectedVariant.id : productDetail.id);
      if (data.error) {
        alert(data.message);
        return;
      }

      this.setState({
        isProductAlreadyInCart: true,
        allowChangeVariant: false,
        cartQuantity: 1,
      });
    } catch (ex) {
      //TODO: bottom sheet message
      alert("Unable to add product in cart");
    } finally {
      this.setCartLoading(false);
    }
  };

  renderVariantAvailableOrNot = (product) => {

    if (this.state.isCartLoading) {
      if (this.state.isProductAlreadyInCart) {
        return (
          <View style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 20,
            backgroundColor: globalStyles.orangeThemeColor,
          }}>
            <Image
              source={require("../../assets/loader4.gif")}
              style={{ width: wp(10), height: wp(10) }}
            />
            {/*<Ionicons name={"cart-outline"} color="white" size={wp(4)} />*/}
          </View>);
      }
    }

    if (this.state.isProductAlreadyInCart) {
      return (
        <View style={{
          flex: 2,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: 20,
          backgroundColor: globalStyles.orangeThemeColor,
        }}>
          <TouchableOpacity onPress={async () => await this.decreaseCartItem()} style={{ paddingRight: wp(5) }}>
            <AntDesign name={"minuscircle"} color="white" size={wp(5)} />
          </TouchableOpacity>
          <Text
            style={{ fontSize: wp(3), fontWeight: "bold", textAlign: "center", color: "white" }}>
            {" " + this.state.cartQuantity + " "} </Text>
          <TouchableOpacity onPress={async () => await this.incrementCartItem()} style={{ paddingLeft: wp(5) }}>
            <AntDesign name={"pluscircle"} color="white" size={wp(5)} /></TouchableOpacity>
          {/*<Ionicons name={"cart-outline"} color="white" size={wp(4)} />*/}
        </View>);
    }

    if (product == null || product == "") {
      return (
        <TouchableOpacity style={{
          flex: 2,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          backgroundColor: globalStyles.orangeThemeColor,
        }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ fontSize: wp(3), fontWeight: "bold", textAlign: "center", color: "white" }}>
              {"Not Available"} </Text>
            {/*<Ionicons name={"cart-outline"} color="white" size={wp(4)} />*/}
          </View></TouchableOpacity>);
    } else {
      return (<>
        {product.isAllowToOrder && (!product.stockTrackingIsEnabled ||
          (product.stockTrackingIsEnabled && product.stockQuantity > 0)) &&
          <TouchableOpacity style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 20,
            backgroundColor: globalStyles.orangeThemeColor,
          }} onPress={async () => await this.addToCart()}>
            <View style={{
              flexDirection: "row",
            }}>

              <Text style={{ fontSize: wp(3), fontWeight: "bold", textAlign: "center", color: "white" }}>
                {"Add to cart"} </Text>
              <Ionicons name={"cart-outline"} color="white" size={wp(4)} />
            </View></TouchableOpacity>
        }
        {!product.isAllowToOrder || (product.stockTrackingIsEnabled && product.stockQuantity <= 0) &&
          <TouchableOpacity style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            backgroundColor: globalStyles.orangeThemeColor,
          }} onPress={async () => await this.addToCart()}>
            <View style={{
              flexDirection: "row",
            }}>
              <Text
                style={{
                  fontSize: wp(3),
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}>
                {"Not"} </Text>
              <Ionicons name={"cart-outline"} color="white" size={wp(4)} />
            </View>
          </TouchableOpacity>
        }
      </>);
    }
  };

  renderProductAvailableOrNot = () => {
    const { productDetail, priceData, isProductAlreadyInCart, selectedVariant } = this.state;
    return (<></>);
  };

  renderVariant = (item) => {
    const { selectedVariant } = this.state;
    return (
      <TouchableOpacity onPress={async () => await this.selectVariant(item)}>
        <View style={{
          height: wp(10),
          width: wp(25),
          borderColor: selectedVariant != null && item.id == selectedVariant.id ? globalStyles.primaryThemeColor : globalStyles.orangeThemeColor,
          borderRadius: wp(1),
          backgroundColor: selectedVariant != null && item.id == selectedVariant.id ? globalStyles.orangeThemeColor : globalStyles.secondaryThemeColor,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
        }}>

          <Text style={{
            fontSize: wp(2.5),
            color: selectedVariant != null && item.id == selectedVariant.id ? "white" : globalStyles.orangeThemeColor,
            fontWeight: "bold",
          }}>{item.normalizedName} </Text>

        </View>
      </TouchableOpacity>
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
    const { productDetail, priceData, isProductAlreadyInCart, selectedVariant } = this.state;
    return (
      <View style={{ backgroundColor: globalStyles.secondaryThemeColor }}>
        <ScrollView style={{ flex: 1, marginTop: wp(15) }}>
          <Swiper style={{ height: hp(28), }}
            // autoplay
            // autoplayDelay={3}
            autoplayLoop
            index={2}
            // showPagination
            activeDotColor={"#dddddd"}
            dotColor={"#dddddd"}


          >
            {
              this.state.sliderImages.map((item, index) => {
                return (
                  <Image source={{ uri: item.url }}
                    style={styles.logoStyle}
                    resizeMethod="resize"
                    resizeMode="cover"
                  />
                );
              },
              )
            }

          </Swiper>
          <Animatable.View animation={"fadeInUpBig"} duration={800} style={{ height: hp(50), width: "90%", backgroundColor: globalStyles.primaryThemeColor, alignSelf: 'center', marginTop: wp(10), borderRadius: 20, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 12, }, shadowOpacity: 0.58, shadowRadius: 16.00, elevation: 24, }} >
            <ScrollView style={{ height: "80%", width: "96%", marginTop: 10, borderRadius: 20 }}>
              {productDetail != "" && productDetail.vendor != null &&

                <Text
                  style={{ fontSize: wp(3), fontWeight: "bold", color: "grey", marginLeft: wp(2), marginVertical: 7 }}>{productDetail.vendor.name} </Text>
              }
              <Text style={{ fontSize: wp(5), fontWeight: "bold", color: "white", marginLeft: wp(2) }}>{productDetail.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: hp(3.5), marginVertical: 8, justifyContent: 'space-between', marginLeft: wp(2) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: wp(30), height: hp(3), marginVertical: 8, justifyContent: 'space-between' }}>
                  <View style={{ width: '40%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Ionicons name={"cart"} color="white" size={wp(4)} />
                    <Text style={{ color: 'white', fontSize: wp(4) }}>4.6k</Text>
                  </View>
                  <View style={{ width: '45%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Ionicons name={"eye"} color="white" size={wp(4)} />
                    <Text style={{ color: 'white', fontSize: wp(4) }}>12.6k</Text>
                  </View>
                </View>
                <Text style={{
                  fontSize: wp(5),
                  fontWeight: "bold",
                  color: 'white',
                  marginHorizontal: wp(2)
                }}>{priceData != null ? priceData.priceString : ""} </Text>
              </View>
              <View style={{ height: hp(6), width: '95%', justifyContent: 'space-between', flexDirection: 'column', marginVertical: wp(3), marginHorizontal: wp(2) }}>
                <Text style={{ fontSize: wp(5), color: 'white' }}>Description</Text>
                <Text style={{
                  fontSize: wp(3.8),
                  fontWeight: "bold",
                  color: "gray",
                }}>{productDetail.shortDescription}</Text>
              </View>
              
              {productDetail.variations && productDetail.variations.length > 0 &&
          <View >
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '97%', height: hp(3.7), marginVertical: 8, justifyContent: 'space-between', marginLeft: wp(2) }}>
            <Text
              style={{ color: 'white',fontSize: wp(5), fontWeight: "bold" }}>{productDetail.availableOptions[0].optionName}</Text>
            <AntDesign name={this.state.isSelected == true ? "up":"down"} color="white" size={wp(5)} onPress={() => this.setState({ isSelected: !this.state.isSelected})} />
            </View>
            {this.state.isSelected == true &&
              <FlatList
              style={{ padding: wp(3) ,backgroundColor:globalStyles.primaryThemeColor}}
              data={productDetail.variations}
              renderItem={({ item, index }) => this.renderVariant(item, index)}
              ItemSeparatorComponent={this.renderSeparator}
              keyExtractor={(item, index) => `post__${item.id}`}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
            }
          
          </View>
          }
              
              
              
            </ScrollView>
            <View style={{ height: "14%", width: "96%", backgroundColor: globalStyles.primaryThemeColor, marginBottom: 5, borderRadius: 20, flexDirection: "row", }}>
              <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: wp(4.5), fontWeight: "bold", color: "white" }}>Total Price </Text>
                <Text style={{
                  fontSize: wp(4),
                  fontWeight: "bold",
                  color: "white",
                }}>{priceData != null ? priceData.priceString : ""} </Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Rating
                  type="heart"
                  ratingCount={1}
                  imageSize={wp(10)}
                  tintColor={globalStyles.primaryThemeColor}
                  ratingBackgroundColor="yellow"
                // showRating
                // onFinishRating={this.ratingCompleted}
                />
              </View>
              {true && this.renderVariantAvailableOrNot(selectedVariant != null ? selectedVariant : productDetail)
              }
            </View>
          </Animatable.View>
        </ScrollView>
        {/* <ScrollView>
        <View style={{height:hp(10),flexDirection:'column',alignItems:'center',marginTop:50}}>
          <View style={{height:hp(8),width:'95%',justifyContent:'space-between',flexDirection:'row',marginVertical:wp(3)}}>
          <View>
          <Text style={{ fontSize: wp(5), fontWeight: "bold", color: globalStyles.orangeThemeColor }}>{productDetail.name}</Text>
          <Text style={{
                fontSize: wp(3.2),
                fontWeight: "bold",
                color: "gray",
              }}>{productDetail.shortDescription}</Text>
              {productDetail != "" && productDetail.vendor != null &&
              <Text
                style={{
                  fontSize: wp(3.2),
                  fontWeight: "bold",
                  color: "gray",
                }}>
                From :
                <Text
                  style={{ fontSize: wp(2.7), fontWeight: "bold", color: "white" }}> {productDetail.vendor.name} </Text>
              </Text>
              }
              </View>
              <View>
              <Text
            style={{
              fontSize: wp(3.5),
              paddingBottom: wp(5),
              paddingLeft: wp(5),
              fontWeight: "bold", color: globalStyles.orangeThemeColor,
            }}>
            Delivery :
            <Text style={{ fontSize: wp(3.5), fontWeight: "bold", color: "white" }}> Available </Text>
          </Text>
              </View>
          </View>
        </View>
          <Swiper style={{ height: hp(35), paddingTop: wp(2) }}
            // autoplay
            // autoplayDelay={3}
                  autoplayLoop
                  index={2}
            // showPagination
                  activeDotColor={"#dddddd"}
                  dotColor={"#dddddd"}


          >
            {
              this.state.sliderImages.map((item, index) => {
                  return (
                    <Image source={{ uri: item.url }}
                           style={styles.logoStyle}
                           resizeMethod="resize"
                           resizeMode="cover"
                    />
                  );
                },
              )
            }

          </Swiper>
          <View style={{ flexDirection: "column",justifyContent:'center',alignItems:'center', height:hp(8),borderTopLeftRadius:15,borderTopRightRadius:15,marginTop:10 ,borderTopWidth:wp(0.5),borderTopColor:globalStyles.orangeThemeColor}}>
          <View style={{height:hp(8),width:'95%',justifyContent:'space-between',flexDirection:'row',marginVertical:wp(3),alignItems:'center'}}>
          <Text style={{
            marginHorizontal:wp(1)  ,
              fontSize: wp(5),
              fontWeight: "bold",
              color: globalStyles.orangeThemeColor,
            }}>{priceData != null ? priceData.priceString : ""} </Text>
             
              <Text style={{
                fontSize: wp(3),
                fontWeight: "bold",
                paddingTop: wp(0.8),
                textAlign: "center",
                color: globalStyles.orangeThemeColor,
                height: hp(3),
                width: wp(14),
                borderColor: globalStyles.orangeThemeColor,
                borderWidth: 1,
                borderRadius: 3,
              }}>Add</Text>
            </View>
        
          </View>
          {productDetail.variations && productDetail.variations.length > 0 &&
          <View >
            <Text
              style={{ color: globalStyles.orangeThemeColor, marginHorizontal:wp(3),fontSize: wp(5), fontWeight: "bold" }}>{productDetail.availableOptions[0].optionName}</Text>
            <FlatList
              style={{ padding: wp(3) }}
              data={productDetail.variations}
              renderItem={({ item, index }) => this.renderVariant(item, index)}
              ItemSeparatorComponent={this.renderSeparator}
              keyExtractor={(item, index) => `post__${item.id}`}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          </View>
          }
          <View style={{height:hp(8),flexDirection:'column',alignItems:'center'}}>
          <View style={{height:hp(6),width:'95%',justifyContent:'space-between',flexDirection:'column',marginVertical:wp(3)}}>
          <Text style={{ fontSize: wp(5), fontWeight: "bold", color: globalStyles.orangeThemeColor }}>Description</Text>
          <Text style={{
                fontSize: wp(3.5),
                fontWeight: "bold",
                color: "gray",
              }}>{productDetail.shortDescription}</Text>
              
          </View>
        </View>

        </ScrollView> */}
        {/* <Animatable.View animation={"fadeInUpBig"} duration={800} style={{
          flexDirection: "row",
          height: hp(7),
          width: "100%",
          backgroundColor: globalStyles.secondaryThemeColor,
        }}>
          <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: wp(4.5), fontWeight: "bold", color: "white" }}>Total Price </Text>
            <Text style={{
              fontSize: wp(4),
              fontWeight: "bold",
              color: "white",
            }}>{priceData != null ? priceData.priceString : ""} </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Rating
              type="heart"
              ratingCount={1}
              imageSize={wp(10)}
              tintColor={globalStyles.secondaryThemeColor}
              ratingBackgroundColor="yellow"
              // showRating
              // onFinishRating={this.ratingCompleted}
            />
          </View>
          {true && this.renderVariantAvailableOrNot(selectedVariant != null ? selectedVariant : productDetail)
          }
        </Animatable.View> */}
      </View>);
  }
}

const styles = StyleSheet.create({
  logoStyle: {
    height: hp(28),
    width: wp("80%"),
    borderRadius: 4,
    alignSelf: "center",
    // elevation: 10
  },
});
