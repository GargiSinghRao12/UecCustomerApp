import React from 'react';
import { BackHandler, StyleSheet, View, Platform, TouchableOpacity, Text, Image, ScrollView, SafeAreaView } from 'react-native';
// import Header from '../common/Header';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import { Item } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-gesture-handler';
import UserApi from '../../services/UserApi';
import { Toast } from 'native-base';
import { simpleToast } from "../../services/utility/toastMessage";


export default class RateDelivery extends React.Component {
    constructor(props) {
        super(props);
        this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
        this.state = {
            vendorFeedback: "",
            Default_Rating: 0,
            Max_Rating: 5,
            orderDetails: undefined,
            reviewerName: "",
            vendorId: null

        };

    }

    navigateToback = () => {
        this.props.navigation.goBack();
    }

    onBackButtonPressed() {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount = async () => {
        console.log("this.props is", this.props);
        let orderDetails = this.props.route.params;
        if (orderDetails != null) {
            this.setState({ orderDetails: orderDetails, vendorId: orderDetails.vendorId })
        }
        let rawData = await AsyncStorage.getItem('loggedInUser')
        let data = JSON.parse(rawData);
        this.setState({ reviewerName: data.fullname })
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
    };

    submitVendorFeedback = async () => {
        const { Default_Rating, vendorFeedback, reviewerName, vendorId, orderDetails } = this.state;
        try {
            let body = {
                "rating": Default_Rating, //mention whatever is the rating
                // "title": "Yeah Yeah", //not needed
                "comment": vendorFeedback, // comment from user
                "reviewerName": reviewerName, // send current logged in user name
                "entityId": vendorId, // vendor id
                "entityTypeId": "Vendor" //just send it like this. no change

            }
            // console.log("boyd", body)
            let response = await UserApi.submitVendorReview(body, this.props)
            console.log("Submit Vendor Feedback responce....",response);
            if (response.message) {
                simpleToast({
                    text: response.message,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    duration: 3000,
                })
                if (orderDetails.deliveryBoyId != 0) {
                    this.props.navigation.navigate('RateDriver', orderDetails)
                } else {
                    this.props.navigation.navigate('Home')
                }
            } else if (response.error) {
                simpleToast({
                    text: response.error,
                    buttonText: "Okay",
                    textStyle: { color: globalStyles.thirdThemeColor },
                    position: "bottom",
                    duration: 3000,
                })
            }
        } catch (error) {
            console.log(error)
        }


    }

    UpdateRating = (key) => {
        // console.log("key", key)
        this.setState({ Default_Rating: key });
        //Keeping the Rating Selected in state
    }
    render() {
        const { orderDetails } = this.state;
        let React_Native_Rating_Bar = [];
        //Array to hold the filled or empty Stars
        for (var i = 1; i <= this.state.Max_Rating; i++) {
            React_Native_Rating_Bar.push(
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={i}
                    onPress={this.UpdateRating.bind(this, i)}>
                    <Image
                        style={styles.StarImage}
                        source={
                            i <= this.state.Default_Rating
                                ? require('../../assets/star_filled.png')
                                : require('../../assets/star_corner.png')
                        }
                    />
                </TouchableOpacity>
            );
        }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={"always"}>
                    <View style={{ backgroundColor: globalStyles.primaryThemeColor, width: wp('100'), height: wp('16'), justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.goBack()} style={styles.backIcon}>
                            <Icon size={30} color={"#fff"} name={"md-arrow-back"} />
                        </TouchableOpacity>
                        <View style={{ flex: 8, flexDirection: "row" }}>
                            <Text style={{ color: "white", fontSize: 10,}}>ORDER FROM </Text>
                            {orderDetails != null && orderDetails.vendorName && <Text style={{ color: "white", fontSize: 10, flexShrink: 1 }}>{orderDetails.vendorName}</Text>}
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Image
                            style={{ width: wp('100'), height: wp('40') }}
                            source={
                                require('../../assets/happy.png')
                            }
                        />
                    </View>
                    <View style={{ flex: 3 }}>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.textStyle}>Rate your order from</Text>
                            {orderDetails != null && orderDetails.vendorName != null && <Text style={styles.textStyleSmall}>Food App</Text>}
                            {/*View to hold our Stars*/}
                            <View style={styles.childView}>{React_Native_Rating_Bar}</View>
                            <Text style={styles.textStyle}>
                                {/*To show the rating selected*/}
                                {this.state.Default_Rating} / {this.state.Max_Rating}
                            </Text>
                            <Text style={styles.textStyleLast}>Your word makes our Food App at a better place. You are the influence!</Text>
                            {/* <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.button}
                        onPress={() => alert(this.state.Default_Rating)}>
                        {/*Clicking on button will show the rating as an alert
                        <Text>Get Selected Value</Text>
                    </TouchableOpacity> */}
                        </View>

                        <View style={{ flex: 1, alignItems: "center" }}>

                            <TextInput
                                onChangeText={(vendorFeedback) => this.setState({ vendorFeedback })}
                                placeholder="Tell us what you loved..."
                                placeholderTextColor="#ffffff"
                                color="#ffffff"
                                style={styles.inputBox}
                            />

                            <TouchableOpacity onPress={() => this.submitVendorFeedback()} style={styles.button}>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>Submit Feedback</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        backgroundColor:"#151515"

    },
    childView: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30,
    },
    button: {
        alignSelf: "center",
        width: wp('90'),
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30,
        padding: 15,
        backgroundColor: '#8ad24e',
    },
    StarImage: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#ffffff',
        marginTop: 15,
    },
    textStyleSmall: {
        textAlign: 'center',
        fontSize: 18,
        color: '#ffffff',
        marginTop: 15,
    },
    textStyleLast: {
        textAlign: 'center',
        fontSize: 12,
        paddingHorizontal: 10,
        color: '#ffffff',
        marginTop: 15,

    },
    backIcon: {
        alignItems: "center",
        flex: 2,
    },
    inputBox: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        width: wp('90')
    }

});