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
import { getProductWidgets } from "../../services/business/product";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { globalStyles } from "../styles/globalStyles";
import ProductBox from "./productBox";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class ProductWidget extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      widgetData: props.widgetData,
    };
  }

  componentDidMount = async () => {

  };

  renderProduct = (item, index) => {
    return (
      <ProductBox
        product={item}
        navigation={this.props.navigation}
      >
      </ProductBox>
    );
  };

  renderProductFlatList = (item, index) => {
    return (
      <View style={{ paddingTop: wp(2), backgroundColor: globalStyles.primaryThemeColor,justifyContent:'center',alignItems:'center' }}>
        <Text style={{ fontSize: wp(4), color: "white", paddingLeft: wp(2) }}>{item.name} </Text>
        <FlatList
          style={{ marginTop: wp(2) }}
          data={item.products}
          keyExtractor={(item, index) => item.name}
          renderItem={({ item, index }) => this.renderProduct(item, index)}
          ItemSeparatorComponent={this.renderSeparator}
          numColumns={2}
          // showsHorizontalScrollIndicator={false}
          // horizontal
        />
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          width: wp(2),
          height: hp(0.4),
          backgroundColor: globalStyles.primaryThemeColor,
        }}
      />
    );
  };

  render() {
    return (<View>
      {this.state.widgetData.length > 0 && this.renderProductFlatList(this.state.widgetData[0], 0)}
      {this.state.widgetData.length > 1 && this.renderProductFlatList(this.state.widgetData[1], 1)}
      {this.state.widgetData.length > 2 && this.renderProductFlatList(this.state.widgetData[2], 2)}
      {this.state.widgetData.length > 3 && this.renderProductFlatList(this.state.widgetData[3], 3)}
      {this.state.widgetData.length > 4 && this.renderProductFlatList(this.state.widgetData[4], 4)}
      {this.state.widgetData.length > 5 && this.renderProductFlatList(this.state.widgetData[5], 5)}
      {this.state.widgetData.length > 6 && this.renderProductFlatList(this.state.widgetData[6], 6)}
      {this.state.widgetData.length > 7 && this.renderProductFlatList(this.state.widgetData[7], 7)}
      {this.state.widgetData.length > 8 && this.renderProductFlatList(this.state.widgetData[8], 8)}
      {this.state.widgetData.length > 9 && this.renderProductFlatList(this.state.widgetData[9], 9)}
      {this.state.widgetData.length > 10 && this.renderProductFlatList(this.state.widgetData[10], 10)}
      {this.state.widgetData.length > 11 && this.renderProductFlatList(this.state.widgetData[11], 11)}
    </View>);
  }
}
