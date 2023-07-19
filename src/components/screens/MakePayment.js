import React, { Component } from 'react';
import { Text, View, SafeAreaView } from 'react-native';


export default class MakePayment extends Component {

    render() {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }} onPress={() => this.props.navigation.navigate('Home')}> MakePayment Screen</Text>
            </SafeAreaView>
        );
    }
}