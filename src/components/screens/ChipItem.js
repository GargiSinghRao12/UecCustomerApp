/** @format */

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import AppTheme, { globalStyles } from "../styles/globalStyles";

// import { withTheme } from "@common";

export default class ChipItem extends React.Component {

  constructor(props) {
    super(props);
    console.log("selected item ", props.item);
    this.state={
      category: props.item,
    };
  }

  onPressCategory = async () => {
    let category = this.state.category;
    console.log("category before changing ", category);
    category.isSelectedCat = !category.isSelectedCat;
    this.setState({
      category: category,
    });

    await this.props.onPress(category);
  };

  render() {
    const { item, label, onPress, selected } = this.props;
    const { category } = this.state;

    return (
      <TouchableOpacity
        onPress={() => this.onPressCategory()}
        style={category && category.isSelectedCat && item.isSelectedCat === true ? styles.containerSelected : styles.container}>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 15,
    backgroundColor: globalStyles.secondaryThemeColor,
    borderColor: globalStyles.orangeThemeColor,
    marginRight: 4,
    marginBottom: 6,
  },
  containerSelected: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 15,
    backgroundColor: globalStyles.orangeThemeColor,
    borderColor: globalStyles.orangeThemeColor,
    marginRight: 4,
    marginBottom: 6,
  },
  selectedCategory: {
    backgroundColor: globalStyles.orangeThemeColor,
  },
  text: {
    fontSize: 14,
    color: "white",

  },

});