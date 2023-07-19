/** @format */

import React from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
} from "react-native";
import ExpendComponent from "../../../src/components/screens/ExpendComponent";
import ChipItem from "../../../src/components/screens/ChipItem";
import AntDesign from "react-native-vector-icons/AntDesign";
import AppTheme, { globalStyles } from "../styles/globalStyles";
import UserApi from "../../services/UserApi";

export default class ProductCatalog extends React.Component {

  constructor(props) {
    super(props);
    this.filter = {};
    this.state = {
      selectedId: -1,
      expanded: true,
      categories: [],
      selectedCategories: [],
    };
  }

  onPress = async(item) => {
    // this.setState({ selectedId: item.id });
    // this.props.onSelectCategory(item);
    // let cat = this.props.categories.find(x=> x.id == item.id);
    // if(cat){
    //   console.log("got the category ", cat);
    //   cat.isSelectedCat = !cat.isSelectedCat;
    // }

    await this.props.onSelectCategory(item);

    // let categoryFilterText = "";
    // this.state.selectedCategories.forEach(item=> categoryFilterText = categoryFilterText + "--" + item.slug);
    // console.log("categoryFilterText value gargi........................",item.slug);
  };

  componentDidMount = async () => {
    // let settings = await getSystemSettings(false);
    // let categories = await UserApi.getAllCategories();

    // console.log("This is are categories data gargi....................",categories);
    // let data = [];
    // if (settings.IsMultiVendorApp) {
    //   data = [{ key: filterKeys.category, name: "Category" },
    //     { key: filterKeys.dish, name: settings.IsFoodAppView == "true" ? "Dishes" : "Products" },
    //     { key: filterKeys.store, name: settings.IsFoodAppView == "true" ? "Restaurants" : "Store" },
    //     { key: filterKeys.price, name: "Price" }];
    // } else {
    //   data = [{ key: filterKeys.category, name: "Category" },
    //     { key: filterKeys.dish, name: settings.IsFoodAppView == "true" ? "Dishes" : "View Products" },
    //     { key: filterKeys.price, name: "Price" }];
    // }

    // let address = await getDefaultAddress();
    // this.setState({
    //   // categories: categories,
    //   // filterHeader: data,
    //   // address: address,
    // });
  };

  render() {
    const { categories } = this.props;
    const { selectedId, expanded } = this.state;
    // const {
    //   theme: {
    //     colors: { background, text },
    //   },
    // } = this.props;

    return (
      <ExpendComponent
        ref="expandComponent"
        contentView={
          <TouchableOpacity onPress={this.toggle} style={styles.button}>
            <Text style={[styles.text, { color: "#fff" }]}>
              Product Catalog
            </Text>
            <AntDesign
              name={
                expanded ? "caretdown" : "caretup"
              }
              size={12}
              color="#fff"
            />
          </TouchableOpacity>
        }
        expandView={
          // <View style={styles.container}>
          //   {categories.map((item, index) => (
          //     <Item
          //       item={item}
          //       key={index}
          //       label={item.name}
          //       onPress={this.onPress}
          //       selected={selectedId == item.id}
          //     />
          //   ))}
          // </View>
          <View style={styles.container}>
            {categories.map((item, index) => (
              <ChipItem
                item={item}
                key={index}
                label={item.name}
                onPress={this.onPress}
                selected={item.isSelected}
              />
            ))}
          </View>

        }
        onChangeStatus={this.onChangeStatus}
      />
    );
  }

  onChangeStatus = (expanded) => {
    this.setState({ expanded });
  };

  toggle = () => {
    this.refs.expandComponent.toggle();
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 10,
    flexWrap: "wrap",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginRight: 5,
  },
});