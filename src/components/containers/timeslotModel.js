import moment from "moment";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { globalStyles as globalStyle } from "../styles/globalStyles";
import React, { Component } from "react";
import ClockIcon from "react-native-vector-icons/EvilIcons";
import { Modal } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export let getTimeSlotPopup = (state, setModalVisible, selectTimeSlot) => {
  return (<Modal
    transparent={true}
    visible={state.timeModalVisible}
    onRequestClose={() => {
      setModalVisible(!state.timeModalVisible);
    }}
  >
    <View style={[styles.modalStyle, {
      borderRadiusTop: 10,
      borderWidth: 2,
      width: wp(90),
      marginLeft: wp(5),
      justifyContent: "center",
      alignItems: "center",
      borderColor: globalStyle.orangeThemeColor,
    }]}>
      <View style={{ height: wp("100%"), borderRadiusTop: 10, width: wp("90%"), justifyContent: "center" }}>
        <View style={{
          backgroundColor: globalStyle.orangeThemeColor,
          borderRadius: 10,
          padding: 8,
          alignItems: "center"
        }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>Available slots</Text>
        </View>

        <View style={{}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{}}
            data={state.timeSlots}
            renderItem={({ item, index }) => renderTimeSlot(item, index, state, selectTimeSlot)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </View>
  </Modal>);
};

export let renderTimeSlot = (item, index, state, selectTimeSlot) => {
  let date = moment().date();
  let dateDay = null;
  let incomingDate = moment(item.fromDeliverySlot && item.toDeliverySlot).date();
  if (date === incomingDate) {
    dateDay = "Today";
  } else {
    dateDay = "Tomorrow";
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => selectTimeSlot(item)} style={styles.TimeSlotItem}>
      <View style={{ marginLeft: 10, flexDirection: "row" }}>
        <ClockIcon name={"clock"} color={globalStyle.primaryThemeColor} size={25} />
        <View style={{ flexDirection: "row" }}>
          <Text
            >{dateDay + "   " + moment(item.fromDeliverySlot).format("hh A") + " " + "To"}</Text>
          <Text
            >{" " + moment(item.toDeliverySlot).format("hh A")}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  TimeSlotItem: {
    backgroundColor: "white",
    height: wp("10%"),
    borderRadius: 2,
    justifyContent: "center"
  },
  selectTimeSlot: {
    color: globalStyle.primaryThemeColor,
    fontWeight: "bold",

  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

