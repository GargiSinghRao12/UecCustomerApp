import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    SafeAreaView,
    Image,
    FlatList,
    Modal,
    Alert

} from 'react-native';
import { simpleToast } from "../../services/utility/toastMessage";
import Checkbox from '@react-native-community/checkbox';
import { globalStyles } from '../styles/globalStyles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import UserApi from '../../services/UserApi';
import AppConfig from '../constants/AppConfig';


export default class ReturnProduct extends React.Component {
    constructor(props) {
        super(props);
        this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
        this.state = {
            waitingLoaderVisible: false,
            isLoading: false,
            parentOrderID: this.props.route.params.parentOrderID,
            childOrdersIDs: [],
            availableReturnProucts: [],
            checked: false,
            ReturnReasonList: [
                {
                    Id: 1,
                    Reason: "Quality issue"
                },
                {
                    Id: 2,
                    Reason: "Incomplete order"
                },
                {
                    Id: 3,
                    Reason: "Product is not required anymore"
                },
                {
                    Id: 4,
                    Reason: "Order is late than expected delivery time"
                },
                {
                    Id: 5,
                    Reason: "Other"
                }
            ],
            ReturnReasonModalVisible: false,
        }

    }

    navigateToback = () => {
        this.props.navigation.goBack();
    }

    rightOption = () => {
        // alert('option press')
    }

    onBackButtonPressed() {
        this.props.navigation.goBack();
        return true;
    }

    renderReturnReasonModalData = (item, index) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => this.selectedReason(item)} style={styles.ReturnReasonItem}>
                <Text>{item.Reason}</Text>
            </TouchableOpacity>
        )
    }
    selectedReason = (item) => {
        this.setState({ ReturnReasonModalVisible: false })
        this.set_order_status(item.Id)
    }

    selectReturnReason = () => {
        if (this.state.childOrdersIDs.length != 0) {
            this.setState({ ReturnReasonModalVisible: true })
        } else {
            simpleToast("Please select atleast one product to make return request");
        }

    }

    setModalVisible(visible) {
        this.setState({ ReturnReasonModalVisible: visible });
    }

    set_order_status = (status) => {
        Alert.alert(
            'Return Order',
            'Are You Sure.....to make Return Request ?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                {
                    text: 'Confirm', onPress: () => {
                        this.proceedReturn(status);
                    }
                },
            ],
            { cancelable: false }
        )

    }

    componentDidMount() {
        console.log("This.Props is.........", this.props);
        const { availableReturnProucts } = this.state
        availableReturnProucts.length = this.props.route.params.returnOrders.length
        availableReturnProucts.fill(false)
        console.log("length of array ==== ", availableReturnProucts.length)
        console.log("data in  array ==== ", availableReturnProucts)
        console.log("this props parentOrderID = ", this.state.parentOrderID)
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
    }

    proceedReturn = async (returnReasonID) => {
        const { parentOrderID, childOrdersIDs } = this.state
        try {
            this.setState({ waitingLoaderVisible: true, isLoading: true })
            let response = await UserApi.returnProducts(parentOrderID, childOrdersIDs, returnReasonID)

            if (response) {
                this.setState({ waitingLoaderVisible: false, isLoading: false })
                simpleToast(response.message);
                this.props.navigation.navigate('Home')
            }
            this.setState({ waitingLoaderVisible: false, isLoading: false })
        }
        catch (error) {

        }
    }

    renderItem = (item, index) => {
        const { childOrdersIDs } = this.state
        // console.log("return order in flat list************  ", item)
        return (
            <View style={styles.listItem}>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                    <Image source={{ uri: AppConfig.BASE_URL + item.thumbnailImage }} style={{ width: wp("20%"), height: wp("20%"), borderRadius: 50 }} />
                </View>
                <View style={{ flex: 4, justifyContent: "space-evenly" }}>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-evenly", alignItems: "center" }}>
                        <Text style={{ color: "black" }}>Name : </Text>
                        <Text style={{ color: "black", flexShrink: 1 }}>{item.productName}</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-evenly", alignItems: "center" }}>
                        <Text>Price (1 Qty) : </Text>
                        <Text>{`\u20B9 ${item.price}`}</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-evenly", alignItems: "center" }}>
                        <Text>Quantity : </Text>
                        <Text>{item.quantity}</Text>
                    </View>
                </View>
                <View style={styles.returnSelectedProduct}>
                    <Checkbox
                        value={this.state.availableReturnProucts[index]}
                        onValueChange={(value) => {
                            try {
                                // this.state.availableReturnProucts.splice(index,index,value)
                                this.state.availableReturnProucts[index] = value
                                this.setState({})
                                console.log("try Value.......");
                            } catch (err) {
                                console.log("error while update ===", err)
                            }

                            console.log("now values in array ====", this.state.availableReturnProucts)

                            if (this.state.availableReturnProucts[index] == true) {
                                childOrdersIDs.push(item.orderItemId)
                            } else {

                                childOrdersIDs.map((value, index) => {
                                    console.log("Map function is executing ====== value=", value, "  index = ", index)
                                    if (value == item.orderItemId) {
                                        childOrdersIDs.splice(index, 1)
                                        // this.setState({})
                                        console.log("ID removed successfully")
                                    }
                                })

                                console.log("Now available IDs are    ", this.state.childOrdersIDs)
                            }

                            // console.log("order ids of selected elemnts ====", this.state.childOrdersIDs)
                        }}
                    />
                </View>
            </View>
        )
    }

    render() {
        const returnOrders = this.props.route.params.returnOrders;
        // console.log("this props parentOrderID = ", this.state.parentOrderID);
        // console.log("return orders *******", returnOrders);
        return (
            <SafeAreaView style={styles.container}>
                {/* <Header screenTitle={'Return Order'} goback={this.navigateToback} rightOption={this.rightOption} /> */}
                <View style={{ padding: 10, backgroundColor: globalStyles.eleventhThemeColor }}>
                    <Text style={{  fontSize: 12, color: "black" }}>RETURN PRODUCTS</Text>
                </View>

                <View style={{ flex: 10 }}>
                    <FlatList
                        style={{}}
                        data={returnOrders}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={styles.buttonOuterStyle}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.buttonInnerStyle} onPress={() => this.selectReturnReason()} >
                        <Text style={{ color: "white" }}>Proceed Return</Text>
                    </TouchableOpacity>
                </View>

                {/*cancel button modal*/}
                <Modal
                    transparent={true}
                    visible={this.state.ReturnReasonModalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.ReturnReasonModalVisible);
                    }}
                >
                    <View style={styles.modalStyle}>
                        <View style={{ height: wp("100%"), width: wp("95%"), justifyContent: "center" }}>
                            <View style={{
                                backgroundColor: globalStyles.primaryThemeColor,
                                padding: 10,
                                alignItems: "center"
                            }}>
                                <Text style={{ color: "white",  fontSize: 15 }}>Select Return Reason</Text>
                            </View>

                            <View style={{}}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    style={{}}
                                    data={this.state.ReturnReasonList}
                                    renderItem={({ item, index }) => this.renderReturnReasonModalData(item, index)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

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
        backgroundColor: "#C9C9C9"
    },
    listItem: {
        flexDirection: "row",
        borderRadius: 5,
        // justifyContent: 'space-around',
        padding: 5,
        margin: 2,
        backgroundColor: "#fff"
    },
    returnSelectedProduct: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    buttonOuterStyle: {
        // flex: 1,
        height: wp('12%'),
        width: wp("100%")
    },
    buttonInnerStyle: {
        // flex: 1,
        height: wp('12'),
        width: wp('100%'),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#689F34",
    },
    modalStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000080',
    },
    ReturnReasonItem: {
        backgroundColor: "white",
        borderRadius: 2,
        justifyContent: "center",
        padding: 10,
        margin: 0.3
    },

})
