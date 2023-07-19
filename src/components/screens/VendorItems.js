import React, { Component } from 'react';
import { Text, View, SafeAreaView, FlatList, Image, StyleSheet, ScrollView, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-snap-carousel';


export default class VendorItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    src: require('../../assets/pizza.jpg'),
                    name: "Pizza"
                },
                {
                    src: require('../../assets/Dosa.jpg'),
                    name: "Dosa"
                },
                {
                    src: require('../../assets/edli.webp'),
                    name: "Edli"
                },
                {
                    src: require('../../assets/pasta.jpg'),
                    name: "Pasta"
                },
                {
                    src: require('../../assets/roll.png'),
                    name: "Masala roll"
                }
            ],
            restaurantData: [
                {
                    src: require('../../assets/pizza.jpg'),
                    name: "Bharwan Da Dhaba",
                    address: "MBM Farms, G.T. Road Amritsar, Punjab, Punjab, India, 143001",
                },
                {
                    src: require('../../assets/Dosa.jpg'),
                    name: "Royal Orchid restaurant ",
                    address: 'Mobor Beach South Goa, Cavelossim 403731 India'
                },
                {
                    src: require('../../assets/edli.webp'),
                    name: "Britania & Food ",
                    address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001'
                },
                {
                    src: require('../../assets/pasta.jpg'),
                    name: "CAFFÉ PALLADIO",
                    address: 'Khatipura Road Khatipura Tiraya, Jaipur 302012 India'
                },
                {
                    src: require('../../assets/roll.png'),
                    name: " Crystal  Restaurant",
                    address: 'Old Rao Junction, IndiaKhatipura Road, punjab India'
                }
            ],
            sliderImages: [
                { src: require('../../assets/banner1.jpg') },
                { src: require('../../assets/banner2.jpg') },
                { src: require('../../assets/banner3.jpg') },
                { src: require('../../assets/banner4.jpg') },
                { src: require('../../assets/banner5.jpg') },
                { src: require('../../assets/banner6.jpg') },
            ]
        }
    }
    renderItem = (item) => {
        console.log("item ===1 ", item)
        return (
            <View style={{ height: wp(48), width: wp(40),margin:wp(3), backgroundColor: globalStyles.secondaryThemeColor, alignItems: 'center' }}>
                <View style={{ width: wp(40), justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Ionicons name={'heart-outline'} color={'gray'} size={wp(4)} />
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Product Description')}>
                    <View style={{ justifyContent: 'center' }}>
                        <Image source={item.src} style={{ height: wp(30), width: wp(32) }} />
                        <Text style={{ fontSize: wp(2.5), color: 'white', fontWeight: 'bold' }}>{item.name} </Text>
                        <Text style={{ fontSize: wp(2.5), color: 'white', fontWeight: 'bold' }}>₹ 245 </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
                                <AirbnbRating
                                    count={5}
                                    showRating={false}
                                    reviews={["Terrible", "Bad", "Good", "Very Good", "Amazing"]}
                                    selectedColor="#f06755"
                                    defaultRating={4}
                                    size={wp(2.6)}
                                />
                            </View>
                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Ionicons name={'chevron-forward-outline'} color={'gray'} size={wp(4)} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderItem1 = (item) => {
        console.log("item ===1 ", item)
        return (
            <View style={{ height: wp(48), width: wp(80), backgroundColor: globalStyles.secondaryThemeColor, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Product Description')}>
                    <View style={{ justifyContent: 'center',paddingTop:wp(4) }}>
                        <Image source={item.src} style={{ height: wp(30), width: wp(73) }} />
                        <Text style={{ fontSize: wp(2.5), color: 'white', fontWeight: 'bold' }}>{item.name} </Text>
                        <Text style={{ fontSize: wp(2.5), color: 'white', fontWeight: 'bold' }}>₹ 245 </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
                                <AirbnbRating
                                    count={5}
                                    showRating={false}
                                    reviews={["Terrible", "Bad", "Good", "Very Good", "Amazing"]}
                                    selectedColor="#f06755"
                                    defaultRating={4}
                                    size={wp(2.6)}
                                />
                            </View>
                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Ionicons name={'chevron-forward-outline'} color={'gray'} size={wp(4)} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    // width: wp(20),
                    height: hp(0.4),
                    backgroundColor: globalStyles.primaryThemeColor
                }}
            />
        );
    };
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.primaryThemeColor }}>
                <ScrollView>
                    <View  style={{justifyContent:'center',alignItems:'center',paddingTop:wp(5)}}>
                        <Carousel
                        // style={{justifyContent:'center',alignItems:'center'}}
                            layout="default"
                            data={this.state.data}
                            renderItem={({ item }) => this.renderItem1(item)}
                            sliderWidth={wp('200%')}
                            itemWidth={wp(77)}
                            autoplay
                            loop
                            enableMomentum={false}
                            lockScrollWhileSnapping={true}
                        />
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                    <FlatList
                        style={{ paddingTop: wp(5) }}
                        data={this.state.data}
                        numColumns={2}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                    </View>
                </ScrollView>

            </SafeAreaView>
        );
    }
}