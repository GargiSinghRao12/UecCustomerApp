import React, { Component } from 'react';
import { Text, View, SafeAreaView, FlatList, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalStyles } from '../styles/globalStyles';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class VendorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    src: require('../../assets/pizza.jpg'),
                    name: "Pizza"
                },
            ],
            vendorsList: this.props.route.params,
        }
    }
    componentDidMount = async () => {
        console.log("received props ==  ", this.props)
        console.log("vender list == ", this.state.vendorsList)
        // await this.fetchLiveLocation();
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    width: wp(1.8),
                    backgroundColor: globalStyles.primaryThemeColor
                }}
            />
        );
    };
    renderItem = (item) => {
        console.log("item AAAAA ===1 ", item)
        return (
            <ImageBackground source={item.src} style={{ height: wp(40), width: wp("99%"), marginTop: wp(2), justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Menu")}>
                    <View style={{ height: wp(20), width: wp("95%"), margin: wp(2), padding: wp(2), backgroundColor: globalStyles.secondaryThemeColor, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <Text style={{ fontSize: wp(3), color: 'white', fontWeight: 'bold' }}>{item.name} </Text>
                        <Text style={{ fontSize: wp(2.5), color: 'gray', fontWeight: 'bold' }}>{item.address} </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 8, }}>
                            <AirbnbRating
                                count={5}
                                showRating={false}
                                reviews={["Terrible", "Bad", "Good", "Very Good", "Amazing"]}
                                selectedColor="#f06755"
                                defaultRating={4}
                                size={wp(3.5)}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name={'location-outline'} color="#f06755" size={wp(4)} />
                                <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'white' }}> 4.6 Km </Text>
                                <Ionicons name={'time-outline'} color="#f06755" size={wp(4)} />
                                <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: 'white' }}> 90' </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: globalStyles.primaryThemeColor }}>
                <FlatList
                    style={{}}
                    data={this.state.vendorsList}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    ItemSeparatorComponent={this.renderSeparator}
                // keyExtractor={(item, index) => `post__${index}`}
                // showsHorizontalScrollIndicator={false}
                // horizontal
                // pagingEnabled={true}

                />
                {/* <Text style={{fontSize:18,fontWeight:'bold'}} onPress={()=>this.props.navigation.navigate('Home')}> VendorList Screen</Text> */}
            </SafeAreaView>
        );
    }
}