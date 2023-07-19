import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Modal,
} from "react-native";

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { visible, isLoading } = this.props;
    return (

      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
      >
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          {isLoading &&
          <Image
            source={require("../../assets/loader4.gif")}
            style={{ width: 100, height: 100 }}
          />
          }
        </View>
      </Modal>
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
    // fontWeight: "bold",
  },
});
