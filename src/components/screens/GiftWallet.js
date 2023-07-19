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
import RWalletIcon from "react-native-vector-icons/Fontisto"; //  wallet
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class Rwallet extends React.Component {
  constructor(props) {
    super(props);
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
    this.state = {
      RWalletTransactionList: [],
      emptyDataFlag: false,
      rewardWallet: null
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
    await this.getRWalletBalance();
    await this.getRWalletTransaction();
    this.setState({ emptyDataFlag: true })
  }

  getRWalletBalance = async () => {
    try {
      let response = await UserApi.getRWallet()
      console.log("getRWalletBalance", response)
      if (response && response.balance) {
        this.setState({ rewardWallet: response.balance })
        AsyncStorage.setItem('RewardMoney', JSON.stringify(response.balance))
      } else {
      }
    } catch (error) {
      console.log(error)
    }
  }

  getRWalletTransaction = async () => {
    try {
    //   this.setState({ waitingLoaderVisible: true, isLoading: true })
      let response = await UserApi.getRWalletTransactionList()
      if (response && response.length > 0) {
        this.setState({ RWalletTransactionList: response })
      } else {

      }
      console.log("getRWalletTransaction", response)

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
    console.log("item************", item)
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
    const { RWalletTransactionList, emptyDataFlag, rewardWallet } = this.state;
    return (
      <SafeAreaView style={styles.container,{flex: 1, backgroundColor: globalStyles.secondaryThemeColor}} >
        {/* <Header screenTitle={'Gift wallet'} goback={this.navigateToback} rightOption={this.rightOption} /> */}

        <View style={{ flex: 2, justifyContent: "center", alignItems: "center", padding: 10 }}>
          <Text style={{ color: "#ffffff", fontSize: 16 }}>Gift wallet can be useful when you are going to purchase products from any merchant. This is a special feature which allow our sanatan customer to be a part of our regular offers and prizes.</Text>
        </View>
        <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", paddingHorizontal: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <RWalletIcon name={"wallet"} color= "#ffffff" size={25} />
            <Text style={{ paddingHorizontal: 5, color: "#ffffff" }}>Gift wallet Money</Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {rewardWallet ? <Text style={{color: "#ffffff"}}>{`\u20B9 ${rewardWallet}`}</Text> : <Text style={{color: "#ffffff"}}>{`\u20B9 `}0</Text>}
          </View>
        </View>
        {(RWalletTransactionList !== null && RWalletTransactionList !== undefined && RWalletTransactionList.length > 0) ?
          <View style={{ flex: 7, }}>
            <Text style={{ fontSize: 20, textAlign: "center", color: "#ffffff", fontWeight: "600", paddingVertical: 10 }}>Gift wallet Transactions</Text>
            <ScrollView horizontal={true} persistentScrollbar={true} ref={ref => this.scrollView = ref}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd({ animated: true });
              }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={RWalletTransactionList}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderFlatListHeader}
              />
            </ScrollView>

          </View>
          :
          (emptyDataFlag == true && <View style={{ flex: 7, justifyContent: "center" }}>
            <Text style={{ color: 'black', fontSize: 16, textAlign: "center",color: "#ffffff" }}>No Transaction Available</Text>
          </View>)
        }
        {
        //   this.state.waitingLoaderVisible &&
        //   <WaitingLoader visible={this.state.waitingLoaderVisible} isLoading={this.state.isLoading} />
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
  },
  listItem: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    width: wp('250'),
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
    // color: "black"
    color:"#ffffff"
  }

});