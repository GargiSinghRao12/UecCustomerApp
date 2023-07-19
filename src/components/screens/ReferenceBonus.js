import React from 'react';
import { BackHandler, StyleSheet, View, FlatList, SafeAreaView, Text, ScrollView } from 'react-native';
// import Header from '../common/Header';
import UserApi from '../../services/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import WaitingLoader from '../screens/WaitingLoader'
import { Toast } from 'native-base';
import moment from 'moment';
import { globalStyles } from '../styles/globalStyles';
import EWalletIcon from "react-native-vector-icons/FontAwesome5"; // wallet


export default class ReferenceBonus extends React.Component {
  constructor(props) {
    super(props);
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
    this.state = {
      sanatanMoneyTransactionList: [],
      emptyDataFlag: false,
      sanatanWallet: null,


    }
  }

  onBackButtonPressed() {
    this.props.navigation.goBack();
    return true;
  }

  navigateToback = () => {
    this.props.navigation.goBack();
  }

  componentDidMount = async () => {
    await this.getEWalletBalance();
    await this.getSanatanMoneyTransaction()
    this.setState({ emptyDataFlag: true })
  }

  getEWalletBalance = async () => {
    try {
      let response = await UserApi.getEWallet()
      // console.log("getEWalletBalance", response)
      if (response && response.balance) {
        this.setState({ sanatanWallet: response.balance })
        AsyncStorage.setItem('SanatanMoney', JSON.stringify(response.balance))

      } else {

      }
    } catch (error) {
      console.log(error)
    }
  }

  getSanatanMoneyTransaction = async () => {
    try {
    //   this.setState({ waitingLoaderVisible: true, isLoading: true })
      let response = await UserApi.getSanatanMoneyTransactionList()
      if (response && response.length > 0) {
        this.setState({ sanatanMoneyTransactionList: response })
      } else {

      }
      // console.log("getSanatanMoneyTransaction", response)

    } catch (error) {

    } finally {
    //   this.setState({ waitingLoaderVisible: false, isLoading: false })

    }
  }

  renderFlatListHeader = () => {
    //View to set in Header
    return (
      <View style={styles.header_footer_style}>
        <View style={styles.headerItemStyle}>
          <Text style={styles.headerItemTextStyle}>Transaction No</Text>
        </View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.headerItemTextStyle}>Date</Text>
        </View>
        <View style={styles.headerItemStyle}>
          <Text style={styles.headerItemTextStyle}>Amount</Text>
        </View>
        <View style={styles.headerItemStyle}>
          <Text style={styles.headerItemTextStyle}>Factor</Text>
        </View>
        <View style={styles.headerItemStyle}>
          <Text style={styles.headerItemTextStyle}>Balance</Text>
        </View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.headerItemTextStyle}>Narration</Text>
        </View>
      </View>
    );
  };


  renderItem = (item) => {
    // console.log("item************", item)
    return (
      <View style={styles.listItem}>
        <View style={styles.listIndividualItems}>
          <Text style={styles.renderListStyle}>{item.transactionNo}</Text>
        </View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.renderListStyle}>{moment(item.createdOn).format('YYYY-MM-DD hh:mm:ss a')}</Text>
        </View>
        <View style={styles.listIndividualItems}>
          <Text style={styles.renderListStyle}>{item.amount}</Text>
        </View>
        <View style={styles.listIndividualItems}>
          <Text style={styles.renderListStyle}>{item.factor}</Text>
        </View>
        <View style={styles.listIndividualItems}>
          <Text style={styles.renderListStyle}>{item.balance}</Text>
        </View>
        <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.renderListStyle}>{item.narration}</Text>
        </View>
      </View>
    )
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#C9C9C9",
        }}
      />
    );
  };

  render() {
    const { sanatanMoneyTransactionList, emptyDataFlag, sanatanWallet } = this.state;
    // console.log("sanatanWallet", sanatanWallet)
    return (
      <SafeAreaView style={styles.container}>
        {/* <Header screenTitle={'Reference Bonus'} goback={this.navigateToback} rightOption={this.rightOption} /> */}
        <View style={{ flex: 2, justifyContent: "center", alignItems: "center", padding: 10 }}>
          <Text style={{ color: globalStyles.eigthThemeColor, fontSize: 16 }}>Reference Bonus can be used to purchase products online on any Merchant platform. Reference Bonus can be used by selecting it as the payment mode at the time of payment.</Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <EWalletIcon name={"wallet"} color={globalStyles.primaryThemeColor} size={25} />
            <Text style={{ paddingHorizontal: 5 }}>Reference Bonus</Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {sanatanWallet ? <Text>{`\u20B9 ${sanatanWallet.toFixed(0)}`}</Text> : <Text>{`\u20B9 `}0</Text>}
          </View>
        </View>
        {(sanatanMoneyTransactionList !== null && sanatanMoneyTransactionList !== undefined && sanatanMoneyTransactionList.length > 0) ?
          <View style={{ flex: 7 }}>
            <Text style={{ fontSize: 20, textAlign: "center", color: "black", fontWeight: "600", paddingVertical: 10 }}>Reference Bonus Transactions</Text>
            <ScrollView horizontal={true} persistentScrollbar={true} ref={ref => this.scrollView = ref}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd({ animated: true });
              }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={sanatanMoneyTransactionList}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderFlatListHeader}
              />
            </ScrollView>
          </View>
          :
          (emptyDataFlag == true && <View style={{ flex: 7, justifyContent: "center" }}>
            <Text style={{ color: 'black', fontSize: 16, textAlign: "center" }}>No Transaction Available</Text>
          </View>)
        }
        {
          this.state.waitingLoaderVisible &&
          <WaitingLoader visible={this.state.waitingLoaderVisible} isLoading={this.state.isLoading} />
        }
      </SafeAreaView>
    );

  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    // backgroundColor: globalStyle.eleventhThemeColor,
  },
  listItem: {
    flexDirection: "row",
    // backgroundColor: "yellow",
    paddingVertical: 15,
    color:"#282828",
    borderRightWidth:1,

  },
  header_footer_style: {
    width: wp('250'),
    flexDirection: "row",
    backgroundColor: "#FFE0B2",
    paddingVertical: 15,
    color:"#ffffff",
    paddingLeft:5
  },
  renderListStyle: {
    // fontSize: 10
    color:"#282828"
  },
  listIndividualItems: {
    flex: 1,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    color:"#ffffff"
  },
  headerItemStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color:"#ffffff"
  },
  headerItemTextStyle: {
    fontSize: 16,
    color:"#ffffff"
  }

});