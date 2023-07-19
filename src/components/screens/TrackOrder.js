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
import MapView, { Marker } from 'react-native-maps';
import StepIndicator from 'react-native-step-indicator';
import MapViewDirections from 'react-native-maps-directions';

const customStyles = {
    stepIndicatorSize: wp(6),
    currentStepIndicatorSize: wp(9),
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: globalStyles.orangeThemeColor,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: globalStyles.orangeThemeColor,
    stepStrokeUnFinishedColor: 'gray',
    separatorFinishedColor: globalStyles.orangeThemeColor,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: globalStyles.orangeThemeColor,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: globalStyles.orangeThemeColor,
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: 'white',
    stepIndicatorLabelFinishedColor: "white",
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: globalStyles.orangeThemeColor
}


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPosition: 1,
            currentLocation: {
                latitude: 27.557976499999995,
                longitude: 76.064392,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            destinationLocation: {
                latitude: 27.558321,
                longitude: 76.064548,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            bikeAngle: undefined,
            arrivingTime: undefined,
            arrivingDistance: undefined,
        }
    }

    componentDidMount = async () => {
        // await this.fetchLiveLocation();
    }
    fetchLiveLocation = async () => {
        let latitude = "";
        let longitude = "";
        await Geolocation.getCurrentPosition(info => {
            console.log("Your current location is == ", info)
            latitude = info.coords.latitude;
            longitude = info.coords.longitude;
            console.log("So now we tracking lat == ", latitude, "   longitude == ", longitude)
            // Geocoder.init(BaseURL.GOOGLE_API_KEY); // use a valid API key
            // Geocoder.from(latitude, longitude)
            //     .then(json => {
            //         var location = json.results[0].formatted_address;
            //         console.log("live location JSON data  == ", json)
            //         console.log("real location = ", location);
            //     })
            //     .catch(error => ("Some error occured  = ", error));
        });


    }

    calculateAngle = (coordinates) => {
        let startLat = coordinates[0]["latitude"]
        let startLng = coordinates[0]["longitude"]
        let endLat = coordinates[1]["latitude"]
        let endLng = coordinates[1]["longitude"]
        let dx = endLat - startLat
        let dy = endLng - startLng

        return Math.atan2(dy, dx) * 180 / Math.PI
    }

    render() {
        const { currentLocation, destinationLocation, bikeAngle, arrivingTime, arrivingDistance } = this.state
        let Time = undefined
        let Distance = undefined
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.primaryThemeColor }}>
                <ScrollView>
                    <MapView
                        style={{ height: hp('54%') }}
                        // mapType="satellite"
                        showsCompass
                        showsBuildings
                        // liteMode
                        loadingEnabled
                        showsTraffic
                        initialRegion={{
                            latitude: 27.557804,
                            longitude: 76.059228,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}

                        onUserLocationChange={(data) => {
                            console.log("user location changed =======================  ", data)
                        }}

                    >

                        <Marker
                            coordinate={destinationLocation}
                            pinColor={globalStyles.orangeThemeColor}

                        />
                        <Marker
                            coordinate={currentLocation}
                            pinColor={globalStyles.primaryThemeColor}
                            rotation={bikeAngle}
                        >
                            <Image source={require('../../assets/boy.png')} resizeMode="contain" style={{ height: hp(8), width: wp(16) }} />
                        </Marker>
                        <MapViewDirections
                            origin={currentLocation}
                            destination={destinationLocation}
                            apikey={BaseURL.GOOGLE_API_KEY}
                            strokeColor={globalStyles.orangeThemeColor}
                            strokeWidth={wp(1)}
                            mode="DRIVING"
                            onReady={(result) => {
                                console.log("map ready data == ", result)
                                Time = result.duration
                                Distance = result.distance
                                this.setState({ arrivingTime: Time.toFixed(2), arrivingDistance: Distance.toFixed(2) })
                                console.log("arriving time == ", arrivingTime, "  distance ===  ", arrivingDistance)
                                if (result.coordinates.length >= 2) {
                                    let angle = this.calculateAngle(result.coordinates)
                                    this.setState({ bikeAngle: angle })
                                    console.log("angle of bike === ", angle)
                                }

                            }}
                            onStart={(data) => {
                                console.log(" data while boy started === ", data)
                            }}
                        />

                    </MapView>
                    <View style={{ backgroundColor: globalStyles.secondaryThemeColor, alignItems: 'flex-end', paddingTop: wp(2), paddingRight: wp(3) }}>
                        <Text style={{ color: 'gray', fontSize: wp(3), }}>
                            ArrivingIn :  <Text style={{ color: globalStyles.orangeThemeColor, fontSize: wp(3.5), fontWeight: 'bold' }}> {arrivingTime} min.    {arrivingDistance} Km</Text>
                        </Text>
                    </View>
                    <View style={{ height: hp(32), flexDirection: 'row', padding: wp(4), backgroundColor: globalStyles.secondaryThemeColor }}>
                        <View style={{ flex: 1 }}>
                            <StepIndicator
                                customStyles={customStyles}
                                currentPosition={this.state.currentPosition}
                                stepCount={4}
                                direction="vertical"
                                labels={["Order Received", "Boy arrived at restaurant", "Order Picked", "Order Delivered"]}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Image source={require('../../assets/deliveryBoy.gif')} style={{ height: hp(16), width: wp(32) }} />
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: wp(2.5), fontWeight: 'bold', color: globalStyles.orangeThemeColor }}>Delivery Boy</Text>
                                <Text style={{ fontSize: wp(4), color: 'gray' }}>Rajeev Yadav</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Ionicons name={'call-outline'} size={wp(4)} color={'gray'} />
                                    <Text style={{ fontSize: wp(3), color: 'gray' }}>9876543210</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: hp(35), flexDirection: 'row', padding: wp(4), backgroundColor: globalStyles.secondaryThemeColor }}>
                        
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
