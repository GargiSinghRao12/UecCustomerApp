import React, { Component } from "react";
import { Text, View, SafeAreaView, ScrollView, Image, StyleSheet, FlatList,StatusBar } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { globalStyles } from "../styles/globalStyles";
import { Rating, AirbnbRating } from "react-native-ratings";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import ProductDetail from "../containers/productDetail";


export default class ProductDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: props.route.params.productId,
      productDetail: props.route.params.productDetail
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center"}}>
      <StatusBar animated={true} backgroundColor={globalStyles.secondaryThemeColor} barStyle={'light-content'} />
        <ProductDetail
          navigation={this.props.navigation}
          productId={this.state.productId}
          productDetail={this.state.productDetail}
        />
      </SafeAreaView>
    );
  }
}
