import React from "react";
import {
  BackHandler,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Modal,
  Text,
  Alert,
  Picker,
  SafeAreaView,
} from "react-native";
import Home from "../../components/screens/Home";
import Header from "react-native/Libraries/NewAppScreen/components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { globalStyles as globalStyle } from "../styles/globalStyles";
import styled from "styled-components";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default class PaymentDone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };

  }
  cb = () => {
    this.props.navigation.navigate("My Orders");
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        "text": "Order Placed",
      });
    }, 3000);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          <ImageSection>
            <Image
              style={{
                width: wp("100%"),
                height: wp("100%"),
              }}
              resizeMode="contain"
              source={require("../../assets/paymentDone2.gif")}
            />
            <SuccessText>{this.state.text}</SuccessText>
            <Divider />
          </ImageSection>

          <TouchableOpacity onPress={this.cb}  style={{
            backgroundColor: globalStyle.orangeThemeColor,
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            width: "50%",
            marginTop: 10,
            marginBottom: wp(6),
            borderRadius: 80,
          }}>
            <Text style={{ color: "#fff" }}>Check Your Order</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 20,
    textAlign: "center",
    color: "black",
  },

});

const ImageSection = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Divider = styled.View`
  width: 80%;
  border-bottom-width: 1px;
  border-bottom-color: #E0E2E5;
`;

const SuccessText = styled.Text`
  color: #ef910a;
  font-size: 20px;
  text-align: center;
  margin: 20px auto;
`;

const PriceText = styled.Text`
  font-size: 40px;
  color: #213052;
  text-align: center;
`;

const CentText = styled.Text`
  font-size: 25px;
`;

const Currency = styled.Text`
  font-size: 24px;
  margin: 0 5px;
  color: #99AAC6;
`;


