import React, { Component } from 'react';
import { Text, View, SafeAreaView, FlatList, Image, StyleSheet, ScrollView, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Geolocation from '@react-native-community/geolocation';
import BaseURL from '../../services/BaseURL';
import ServiceURL from '../../services/ServiceURL';
import RequestMethod from '../../services/RequestMethod';
import Geocoder from 'react-native-geocoding';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { globalStyles } from '../styles/globalStyles';
import UserApi from "../../services/UserApi";
import AppConfig from "../../components/constants/AppConfig";
import moment from "moment";
import CallIcon from "react-native-vector-icons/Ionicons";
import { MakeCall } from '../utils/Utility';
import { MakeCallDeliver } from '../utils/UtilityDriver';

export default class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderProduct: [],
            emptyDataFlag: false,
            // data: [
            //     {
            //         src: require('../../assets/pizza.jpg'),
            //         name: "Dominos Onion Pizza",
            //         price: 300,
            //         description: "Onion pizza with exta cheeze and delicious taste",
            //         orderStatus: "Not delivered"
            //     },
            //     {
            //         src: require('../../assets/Dosa.jpg'),
            //         name: "Masala Dosa",
            //         price: 100,
            //         description: "Sotuh indian food and taste",
            //         orderStatus: "Not delivered"
            //     },
            //     {
            //         src: require('../../assets/edli.webp'),
            //         name: "Pure veg Edli",
            //         price: 90,
            //         description: "Made from pure rice",
            //         orderStatus: "delivered"
            //     },
            //     {
            //         src: require('../../assets/pasta.jpg'),
            //         name: "Spicy Pasta",
            //         price: 40,
            //         description: "Aakhri pasta chunky pandey ka",
            //         orderStatus: "delivered"
            //     },
            //     {
            //         src: require('../../assets/roll.png'),
            //         name: "Masala roll",
            //         price: 35,
            //         description: "Made from pure various masala ingredients ",
            //         orderStatus: "delivered"
            //     }
            // ],
            // restaurantData: [
            //     {
            //         src: require('../../assets/pizza.jpg'),
            //         name: "Bharwan Da Dhaba",
            //         address: "MBM Farms, G.T. Road Amritsar, Punjab, Punjab, India, 143001",
            //     },
            //     {
            //         src: require('../../assets/Dosa.jpg'),
            //         name: "Royal Orchid restaurant ",
            //         address: 'Mobor Beach South Goa, Cavelossim 403731 India'
            //     },
            //     {
            //         src: require('../../assets/edli.webp'),
            //         name: "Britania & Food ",
            //         address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001'
            //     },
            //     {
            //         src: require('../../assets/pasta.jpg'),
            //         name: "CAFFÉ PALLADIO",
            //         address: 'Khatipura Road Khatipura Tiraya, Jaipur 302012 India'
            //     },
            //     {
            //         src: require('../../assets/roll.png'),
            //         name: " Crystal  Restaurant",
            //         address: 'Old Rao Junction, IndiaKhatipura Road, punjab India'
            //     }
            // ],
            // sliderImages: [
            //     { src: require('../../assets/banner1.jpg') },
            //     { src: require('../../assets/banner2.jpg') },
            //     { src: require('../../assets/banner3.jpg') },
            //     { src: require('../../assets/banner4.jpg') },
            //     { src: require('../../assets/banner5.jpg') },
            //     { src: require('../../assets/banner6.jpg') },
            // ]
        }
    }

    componentDidMount = async () => {
        // await this.fetchLiveLocation();
        await this.getOrders();
        this.setState({ emptyDataFlag: true })
    }

    getOrders = async () => {
        try {
            // this.setState({ waitingLoaderVisible: true, isLoading: true })
            let response = await UserApi.getUserOrders()
            if (response) {
                this.setState({ orderProduct: response.data })
                this.setState({ waitingLoaderVisible: false, isLoading: false })
            }
            console.log("********order history", response)
            console.log("********order history Data", response.data)
            // console.log("inside home", deviceHeight, deviceWidth)
            // this.setState({ waitingLoaderVisible: false, isLoading: false })
            // BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
        }
        catch (error) {
            console.log(error);
        }
    };

    deliveryCall = async (mobile) => {
        MakeCallDeliver(`+91${mobile}`)
    }

    vendorCall = async (mobile) => {
        MakeCall(`+91${mobile}`)
    }

    stars = (item, index) => {
        console.log("item ===1 ", item)

        return (
            <View style={{ flexDirection: 'row', marginHorizontal: wp(1.5), backgroundColor: globalStyles.secondaryThemeColor }}>
                <TouchableOpacity style={{ flex: 3.5, flexDirection: 'row' }}
                    onPress={() => this.props.navigation.navigate('Order Invoice', { ProductId: item.id, returnOrders: item.orderItems })}
                >
                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', height: hp(15) }}>
                        <Image source={{ uri: AppConfig.BASE_URL + item.orderItems[0].thumbnailImage }} style={{ height: hp(13), width: wp(25) }} />
                    </View>
                    <View style={{ flex: 2, padding: wp(1.5) }}>
                        <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', color: 'white' }}>{item.orderItems[0].productName}</Text>
                        <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'white' }}> ₹ {item.orderTotal}</Text>
                        {item.orderStatus == 70 &&
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('RateDelivery', item)}>
                                <View style={{ height: hp(4), width: wp(18), justifyContent: 'center', alignItems: 'center', marginTop: 22, backgroundColor: globalStyles.orangeThemeColor }}>
                                    <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'white', paddingVertical: 3 }}>Rate Order</Text>
                                </View>
                            </TouchableOpacity>
                        }

                        {/* {(item.orderStatus == 120 || item.orderStatus == 130) ?
                            <View style={{ height: hp(4), width: wp(18), justifyContent: 'center', alignItems: 'center', marginTop: 22, backgroundColor: globalStyles.orangeThemeColor }}>
                                <TouchableOpacity onPress={() => this.deliveryCall(item.deliveryBoyMobile)} style={{ width: wp("15%"), height: wp("8%"), backgroundColor: globalStyles.orangeThemeColor, padding: 5, justifyContent: "center", alignItems: "center", borderRadius: 5, borderColor: globalStyles.primaryThemeColor }} activeOpacity={.9}>
                                    <CallIcon name={"ios-call"} color={"white"} size={18} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ height: hp(4), width: wp(18), justifyContent: 'center', alignItems: 'center', marginTop: 22, backgroundColor: globalStyles.orangeThemeColor }}>
                                <TouchableOpacity onPress={() => this.vendorCall(item.vendorMobile)} style={{ width: wp("15%"), height: wp("8%"), backgroundColor: globalStyles.orangeThemeColor, padding: 5, justifyContent: "center", alignItems: "center", borderRadius: 5, borderColor: globalStyles.primaryThemeColor }} activeOpacity={.9}>
                                    <CallIcon name={"ios-call"} color={"white"} size={18} />
                                </TouchableOpacity>
                            </View>
                        } */}
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-around" }}>
                    <Text style={{ fontSize: wp(3), color: 'gray' }}>{moment(item.toSlot).format("DD/MM/YYYY")}</Text>
                    {item.orderStatus == 70 &&
                        <View style={{ height: hp(4), width: wp(15), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'green' }}>Delivered</Text>
                        </View>
                    }
                    {item.orderStatus == 80 &&
                        <View style={{ height: hp(4), width: wp(15), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'green' }}>Cancelled</Text>
                        </View>
                    }
                    {item.orderStatus == 70 && item.orderType == 1 && 
                        <View style={{ height: hp(4), width: wp(15), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'green' }}>Returned</Text>
                        </View>
                    }
                    {/* {item.orderStatus == 1 || item.orderStatus == 10 || item.orderStatus == 20 || item.orderStatus == 30 || item.orderStatus == 35 || item.orderStatus == 40 || item.orderStatus == 50 || item.orderStatus == 60 || item.orderStatus == 90 || item.orderStatus == 100 || item.orderStatus == 110 || item.orderStatus == 120 || item.orderStatus == 130 || item.orderStatus == 140 && */}
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Track Order')}>
                            <View style={{ height: hp(4), width: wp(15), justifyContent: 'center', alignItems: 'center', backgroundColor: globalStyles.orangeThemeColor }}>
                                <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'white' }}>Track</Text>
                            </View>
                        </TouchableOpacity>
                    {/* } */}

                </View>
            </View>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: wp(1.8),
                    backgroundColor: globalStyles.primaryThemeColor
                }}
            />
        );
    };

    render() {

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.primaryThemeColor }}>
                <View style={{ height: wp(15), flexDirection: 'row', alignItems: 'center', paddingLeft: wp(3), backgroundColor: globalStyles.secondaryThemeColor }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}><Ionicons name={'arrow-back-outline'} color="white" size={wp(6)} /></TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: wp(5) }}> My Orders</Text>
                </View>
                <FlatList
                    style={{ paddingTop: wp(2) }}
                    // data={this.state.data}
                    data={this.state.orderProduct}
                    renderItem={({ item, index }) => this.stars(item, index)}
                    ItemSeparatorComponent={this.renderSeparator}
                // pagingEnabled={true}

                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    logoStyle: {
        height: wp('35%'),
        width: wp('97%'),
        alignSelf: 'center',
        borderRadius: 3,
        // elevation: 10
    },
});
