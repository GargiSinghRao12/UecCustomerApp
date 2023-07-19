import React, { Component } from 'react';
import { Text, View, SafeAreaView, FlatList, Image, StyleSheet, ScrollView, TextInput, StatusBar, TouchableOpacity, Alert, } from 'react-native';
import Swiper from 'react-native-swiper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { globalStyles } from '../styles/globalStyles';
import UserApi from "../../services/UserApi";
import moment from "moment";
import { simpleToast } from "../../services/utility/toastMessage";

export default class OrderInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            waitingLoaderVisible: false,
            isLoading: false,
            // orderID: this.props.navigation.state.params.order_id,
            // orderStatus: this.props.navigation.state.params.oredrStatus,
            orderhistorydetail: {},
            customerName: "",
            vendorName: "",
            customerMobile: "",
            vendorMobile: "",
            itemTotal: "",
            GST: "",
            deliveryCharge: "",
            grandTotal: "",
            discountAmount: "",
            deliveryBoyName: "",
            paymentMode: "",
            subTotal: "",
            deliveredTime: "",
            orderId: undefined,
            orderStatus: null,
            returnOrders: []
            // data: [
            //     {
            //         name: "Dominos Onion Pizza",
            //         price: 300,
            //         qty: 2,
            //     },
            //     {
            //         name: "Masala Dosa",
            //         price: 100,
            //         qty: 1,
            //     },
            //     {
            //         name: "Pure veg Edli",
            //         price: 90,
            //         qty: 2,
            //     },
            //     {
            //         name: "Spicy Pasta",
            //         price: 40,
            //         qty: 1,
            //     },
            //     {
            //         name: "Masala roll",
            //         price: 35,
            //         qty: 2,
            //     }
            // ],
        }
    }

    componentDidMount = async () => {
        console.log("this.props print.........", this.props);
        this.state.orderId = this.props.route.params.ProductId;
        this.state.returnOrders = this.props.route.params.returnOrders;
        console.log("this.props.route.params.ProductId.............", this.state.orderId);
        await this.getBillingDetails()
        // await this.fetchLiveLocation();
    }

    getBillingDetails = async () => {
        console.log("Hello I am in getBillingDetails.........");
        const { orderId } = this.state
        try {
            this.setState({ waitingLoaderVisible: true, isLoading: true })
            let response = await UserApi.getBillingDetails(orderId)
            console.log("Billing API response ====", response)
            if (response) {
                this.setState({
                    orderhistorydetail: response,
                    customerName: response.shippingAddress.contactName,
                    vendorName: response.vendorFullName,
                    customerMobile: response.shippingAddress.phone,
                    // vendorMobile: "",
                    itemTotal: response.orderTotal,
                    deliveryBoyName: response.deliveryBoyName,
                    discountAmount: response.discountAmount,
                    GST: response.taxAmount,
                    deliveryCharge: response.shippingAmount,
                    venderAddress: response.vendorFullAddress,
                    customerAddress: response.shippingAddress.addressLine1,
                    paymentMode: response.paymentMethod,
                    subTotal: response.subtotal,
                    deliveredTime: response.toSlot,
                    orderStatus: response.orderStatus,

                })
                console.log("xdkvujhardigkhiltkhblksjng....................", this.state.orderhistorydetail,
                    this.state.customerName,
                    this.state.vendorName,
                    this.state.customerMobile,
                    // vendorMobile: "",
                    this.state.itemTotal,
                    this.state.deliveryBoyName,
                    this.state.discountAmount,
                    this.state.GST,
                    this.state.deliveryCharge,
                    this.state.venderAddress,
                    this.state.customerAddress,
                    this.state.paymentMode,
                    this.state.subTotal,
                    this.state.orderStatus,
                    this.state.deliveredTime);

                // var utcDate = response.toSlot;  // ISO-8601 formatted date returned from server
                // var localDate = new Date(utcDate);
                // console.log("your local date ===", localDate)
                // this.setState({ deliveredTime: localDate })
                // this.setState({ waitingLoaderVisible: false, isLoading: false })
            }
            // console.log("data inside order history details  ", this.state.orderhistorydetail)
            // console.log("********order history", response.data)
            // console.log("inside home", deviceHeight, deviceWidth)
            // this.setState({ waitingLoaderVisible: false, isLoading: false })
            // BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
        }
        catch (error) {
            // console.log(error);
        }
    }

    cancel_Order = (orderID) => {
        // console.log("order is cancelled")
        Alert.alert(
            'Cancel Order',
            'Are You sure, you want to Cancel this Order ?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                { text: 'Confirm', onPress: () => { this.Cancelling_order(orderID) } }
            ]
        )
    }

    Cancelling_order = async (orderID) => {
        // console.log("Order ID = ", orderID)
        try {
            this.setState({ waitingLoaderVisible: true, isLoading: true })
            console.log('cancle order before calling')
            let response = await UserApi.cancel_Order(orderID);
            console.log('cancle order After calling....', response.statusCode)
            if (response.statusCode == 200) {
                // this.setState({ waitingLoaderVisible: false, isLoading: false });
                simpleToast(response.message);
                this.props.navigation.navigate('Home');

            } else {
                this.setState({ waitingLoaderVisible: false, isLoading: false })
            }
            this.setState({ waitingLoaderVisible: false, isLoading: false });
        } catch (error) {

        }
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 0.8,
                    width: "100%",
                    backgroundColor: "gray",
                }}
            />
        );
    }

    renderItem = (item) => {
        // console.log("order history************", item)
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: hp(4), marginLeft: wp(1.5) }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'center', color: 'gray', fontSize: wp(2.7) }}>{item.productName}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'center', color: 'gray' }}>{item.quantity}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'center', color: 'gray' }}>{`\u20B9 ${item.productPrice}`}</Text>
                </View>
            </View>
        )
    }


    render() {
        const { orderhistorydetail,
            vendorName,
            customerMobile,
            vendorMobile,
            itemTotal,
            GST,
            deliveryCharge,
            customerName,
            venderAddress,
            customerAddress,
            deliveryBoyName,
            discountAmount

        } = this.state

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.secondaryThemeColor }}>
                <ScrollView >
                    <View style={{ padding: wp(3), borderBottomWidth: 1, borderColor: globalStyles.orangeThemeColor }}>
                        <Text style={{ fontSize: wp(3), color: globalStyles.orangeThemeColor }}>PRODUCT DETAIL</Text>
                    </View>
                    <View style={{ height: hp(12), flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: 'gray', margin: wp(4) }}>Order ID : #{this.state.orderId}</Text>
                    </View>
                    <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray', paddingLeft: wp(5) }}>Thanks for choosing Our Application, Here are your order details :</Text>
                    <View style={{ height: hp(25), margin: wp(3) }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Ionicons name={"location-outline"} color="gray" size={wp(5)} />
                            <View style={{ marginLeft: wp(2) }}>
                                <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', color: 'gray' }}>{vendorName}</Text>
                                <Text style={{ fontSize: wp(2.6), paddingRight: wp(4), color: 'gray' }}>{venderAddress}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1.2, flexDirection: 'row' }}>
                            <Ionicons name={"home-outline"} color="gray" size={wp(5)} />
                            <View style={{ marginLeft: wp(2) }}>
                                <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', color: 'gray' }}>{customerName}</Text>
                                <Text style={{ fontSize: wp(2.7), color: 'gray' }}>{customerMobile}</Text>
                                <Text style={{ fontSize: wp(2.7), marginRight: wp(4), color: 'gray' }}>{customerAddress}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 0.8, flexDirection: 'row' }}>
                            {this.state.orderStatus == 70 &&
                                <FontAwesome name={"check"} color="green" size={30} />
                            }
                            {this.state.orderStatus == 170 &&
                                <FontAwesome name={"undo"} color="green" size={25} />
                            }
                            {this.state.orderStatus == 80 &&
                                <FontAwesome name={"times"} color="red" size={30} />
                            }
                            {this.state.orderStatus != 1 && this.state.orderStatus == 1 || this.state.orderStatus == 10 || this.state.orderStatus == 20 || this.state.orderStatus == 30 || this.state.orderStatus == 35 || this.state.orderStatus == 40 || this.state.orderStatus == 50 || this.state.orderStatus == 60 || this.state.orderStatus == 90 || this.state.orderStatus == 100 || this.state.orderStatus == 110 || this.state.orderStatus == 120 || this.state.orderStatus == 130 || this.state.orderStatus == 140 &&
                                <FontAwesome name={"history"} color="green" size={25} />
                            }
                            <View style={{ marginLeft: wp(2) }}>
                                {this.state.orderStatus == 70 &&
                                    <View>
                                        <Text style={{ fontSize: wp(2.7), fontWeight: 'bold', color: 'gray' }}>Order delivered on {moment(this.state.deliveredTime).format('DD-MM-YYYY')}</Text>
                                        <Text style={{ fontSize: wp(3), color: 'gray' }}>Delivered by <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', color: 'gray' }}>{deliveryBoyName}</Text> </Text>
                                    </View>
                                }
                                {this.state.orderStatus == 170 &&
                                    <View>
                                        <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}>You returned this order .</Text>
                                    </View>
                                }
                                {this.state.orderStatus == 80 &&
                                    <View>
                                        <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}>You cancelled this order . </Text>
                                    </View>
                                }
                                {this.state.orderStatus != 1 && this.state.orderStatus == 1 || this.state.orderStatus == 10 || this.state.orderStatus == 20 || this.state.orderStatus == 30 || this.state.orderStatus == 35 || this.state.orderStatus == 40 || this.state.orderStatus == 50 || this.state.orderStatus == 60 || this.state.orderStatus == 90 || this.state.orderStatus == 100 || this.state.orderStatus == 110 || this.state.orderStatus == 120 || this.state.orderStatus == 130 || this.state.orderStatus == 140 &&
                                    <View>
                                        <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', color: 'gray' }}>Your order is processing .</Text>
                                        <Text style={{ fontSize: wp(2.7), fontWeight: 'bold', color: 'gray' }}>will be delivered soon .</Text>
                                    </View>
                                }
                            </View>
                            {this.state.orderStatus == 70 &&
                                <View style={{ flexDirection: "row", marginLeft: 100, marginTop: -20 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ReturnProduct', { returnOrders: this.state.returnOrders, parentOrderID: this.state.orderId })}>
                                        <View style={{ height: hp(4), width: wp(18), justifyContent: 'center', alignItems: 'center', marginTop: 22, backgroundColor: globalStyles.orangeThemeColor, }}>
                                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'white', paddingVertical: 3 }}>Return Order</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            {this.state.orderStatus == 170 &&
                                <View style={{ flexDirection: "row", marginLeft: 100, marginTop: -20 }}>
                                    <TouchableOpacity onPress={() => this.cancel_Order(this.state.orderId)}>
                                        <View style={{ height: hp(4), width: wp(18), justifyContent: 'center', alignItems: 'center', marginTop: 22, backgroundColor: globalStyles.orangeThemeColor, }}>
                                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'white', }}>CANCEL ORDER</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'gray', height: wp(10), marginLeft:10,marginRight:10, alignContent:"center",alignItems:"center" }}>
                        <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'black' }}>Item Name</Text>
                        <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'black' }}>Quantity</Text>
                        <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'black' }}>Price <Text style={{ fontSize: wp(2.5) }}>(per Qty.)</Text></Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <FlatList
                            style={{}}
                            data={orderhistorydetail.orderItems}
                            renderItem={({ item, index }) => this.renderItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                        // keyExtractor={item => item.email}
                        />
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: wp(8) }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}>Item Total</Text>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}>GST</Text>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}>Delivery Charges</Text>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}>Disocunt Applied</Text>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray', marginTop: wp(3), marginBottom: wp(3) }}>Payment mode : <Text style={{ color: 'green' }}>{this.state.paymentMode}</Text></Text>

                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}> ₹ {this.state.subTotal}</Text>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}> ₹ {GST}</Text>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}> ₹ {deliveryCharge}</Text>
                            <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'gray' }}>- ₹ {discountAmount}</Text>
                            <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', color: 'green' }}>Bill Total  :  ₹ {itemTotal}</Text>
                        </View>
                    </View>
                </ScrollView>


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
