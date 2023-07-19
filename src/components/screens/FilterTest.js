import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Tools from "../../../src/components/screens/Tools";
import Slider from "react-native-fluid-slider";
import ProductCatalog from "../../../src/components/screens/ProductCatalog";
import { globalStyles } from "../styles/globalStyles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { searchItem } from "../../services/business/search";
import { getDefaultAddress } from "../../services/business/address";
import ChipItem from "./ChipItem";

export default class FilterTest extends React.Component {
  constructor(props) {
    super(props);
    console.log("props ", props.bottomSheet);
    this.filter = {};
    this.state = {
      value: 2000,
      selectedCategories: [],
      searchOptions: {
        pageSize: 20,
        page: 1,
        category: "all",
      },
      searchText: "",
      address: {},
      searchType: "product",
    };
  }

  onValueChange = (value) => {
    this.filter = { ...this.filter, max_price: value };
    this.setState({
      max_price: value,
    });
  };

  onFilter = async () => {
    this.props.bottomSheet.close();
    const { selectedCategories, max_price } = this.state;
    let options = {
      price: max_price,
      category: "",
    };

    if (selectedCategories && selectedCategories.length > 0) {
      selectedCategories.forEach(x => {
        if (options.category == "") {
          options.category = x.slug;
        } else {
          options.category = options.category + "--" + x.slug;
        }
      });
    }

    await this.props.searchWithFilter(options);
    // this.props.navigation.setOptions({ Item: this.filter })
    // this.props.navigation.navigate("Search",{ Item: this.filter });
  };

  clearFilter = async () => {
    this.props.bottomSheet.close();
    let options = {
      price: 0,
      category: "",
    };

    this.setState({
      selectedCategories: [],
    });

    await this.props.searchWithFilter(options);
  };

  onSelectCategory = async (item) => {
    let categoryFound = this.state.selectedCategories.find(x => x.id == item.id);
    if (categoryFound) {
      if (item.isSelectedCat == false) {
        let categories = this.state.selectedCategories.filter(x => x.id != item.id);
        this.setState({
          selectedCategories: categories,
        });
      }
    } else {
      let categories = this.state.selectedCategories;
      categories.push(item);
      this.setState({
        selectedCategories: categories,
      });
    }

    console.log("selected categories ", this.state.selectedCategories);
  };

  render() {
    const { categories, tags } = this.props;

    return (
      <ScrollView style={[styles.container, { backgroundColor: globalStyles.primaryThemeColor }]}>
        <View style={styles.content}>
          <Text style={[styles.headerLabel, { color: globalStyles.orangeThemeColor }]}>
            Filters
          </Text>

          <ProductCatalog
            categories={categories}
            onSelectCategory={this.onSelectCategory}
          />

          {/* 
          <ProductTags tags={tags} onSelectTag={this.onSelectTag} />
          */}
          <Text style={[styles.pricing, { color: globalStyles.orangeThemeColor, marginTop: 50 }]}>
            Pricing
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>{Tools.getCurrecyFormatted(0)}</Text>
            <Text style={styles.value}>
              {Tools.getCurrecyFormatted(this.state.max_price)}
            </Text>
            <Text style={styles.label}>{Tools.getCurrecyFormatted(10000)}</Text>
          </View>
        </View>
        <View style={styles.slideWrap}>
          <Slider
            value={this.state.value}
            onValueChange={this.onValueChange}
            onSlidingComplete={(value) => {
              // console.warn("Sliding Complete with value: ", value);
            }}
            minimumTrackTintColor={globalStyles.orangeThemeColor}
            maximumTrackTintColor="#bdc2cc"
            thumbTintColor={globalStyles.orangeThemeColor}
            minimumValue={0}
            maximumValue={10000}
          />
        </View>

        <View>
          <TouchableOpacity onPress={async () => this.props.bottomSheet.close()} style={styles.btnFilter}>
            {/* <Text style={styles.filterText}>{Languages.Filter}</Text> */}
            <Text style={styles.filterText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity style={styles.btnClear} onPress={this.clearFilter}> */}
        {/* <Text style={styles.clearFilter}>{Languages.ClearFilter}</Text> */}
        {/* <Text style={styles.clearFilter}>Cancel</Text>
        </TouchableOpacity> */}
        <View style={{
          flexDirection: "row",
          height: hp(7),
          width: "100%",
          position: "absolute",
          bottom: 0,
          backgroundColor: globalStyles.secondaryThemeColor,
          marginBottom: 20,
        }}>
          <TouchableOpacity onPress={this.clearFilter}
                            style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: wp(4), color: "white" }}> Cancel </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.onFilter} style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: globalStyles.orangeThemeColor,
          }}>
            <Text style={{ fontSize: wp(4), textAlign: "center", color: "white" }}> Apply </Text>
            {/* <Ionicons name={'cart-outline'} color="white" size={wp(4)} /> */}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }


  onSelectTag = (item) => {
    this.filter = { ...this.filter, tag: item.id };
  };

  clearFilter = async () => {
    this.filter = {};
    await this.props.clearFilter();
  };
  cancel = () => {
    this.filter = {};
    this.props.navigation.navigate("Search");
  };
  componentDidMount = async () => {
    let address = await getDefaultAddress();
    this.setState({
      address: address,
    });
    console.log("Address Value....", address);
  };


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  content: {
    marginTop: 40,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  label: {
    fontSize: 13,
    color: "#bdc2cc",
  },
  value: {
    fontSize: 16,
    color: "#bdc2cc",
  },
  slideWrap: {
    marginHorizontal: 20,
  },
  pricing: {
    fontSize: 16,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    color: "white",
  },
  btnFilter: {
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: globalStyles.orangeThemeColor,
    marginHorizontal: 15,
    marginVertical: 10,
    marginTop: 30,
    marginBottom: 100,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filterText: {
    fontSize: 16,
    color: "#fff",
  },
  clearFilter: {
    fontSize: 16,
    color: globalStyles.orangeThemeColor,
  },
  btnClear: {
    marginBottom: 20,
    marginTop: 10,
    alignSelf: "center",
    color: "white",
  },
  btnBack: {
    position: "absolute",
    //   top: Device.isIphoneX ? 50 : 20,
    left: 0,
  },
  headerLabel: {
    color: "#333",
    fontSize: 28,
    //   fontFamily: Constants.fontHeader,
    marginBottom: 0,
    marginLeft: 20,
  },
});