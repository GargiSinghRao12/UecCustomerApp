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
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { globalStyles } from "../styles/globalStyles";

export default class ProductBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
    };
    this.navigation = props.navigation;
  }

  componentDidMount = async () => {

  };

  render() {
    let product = this.state.product;
    return (
      <View style={{
        // height: hp(20),
        marginBottom: wp(2),
        // width: wp(40),
        margin:wp(3),
        borderRadius: 2,
        backgroundColor: globalStyles.secondaryThemeColor,
        height: hp(24), width: wp(44),
      }}>
        <TouchableOpacity key={product} onPress={() => this.navigation.navigate("Product Description", {productId: product.id})}>
          <View style={{ alignItems: "center", marginTop: wp(2.7) }}>
            <Image source={{ uri: product.thumbnailUrl }} style={{ height: hp(15), width: wp(37), borderRadius: 2,marginBottom:1.5 }} />
            {/* <Text style={{ fontSize: 11, color: 'gray', fontWeight: 'bold' }}>{product.address} </Text> */}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(4) }}>
            <Text style={{ fontSize: wp(2.9), fontWeight: "bold", color: "white" }}>{product.name} </Text>
            <Text style={{ fontSize: wp(2.9), fontWeight: "bold", color: globalStyles.orangeThemeColor }}> ₹ {product.price} </Text>
          </View>
          <View style={{ flexDirection: "row",justifyContent: "space-between",marginLeft:5, alignItems: "flex-end",paddingHorizontal: wp(2) }}>
            <View style={{
              height: hp(2.4),
              width: wp(12),
              marginTop: wp(2),
              borderColor: globalStyles.orangeThemeColor,
              borderWidth: 1,
              borderRadius: 3,
            }}>
              <Text style={{ fontSize: 10, textAlign: "center", color: globalStyles.orangeThemeColor }}>Add</Text>
            </View>
            <View style={{width:100,marginLeft:15}}>
            <Text style={{ fontSize: wp(2.9), fontWeight: "bold", color: "white" }}>{product.vendorName} </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
