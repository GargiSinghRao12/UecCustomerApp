/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Button,
} from "react-native";

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Spalsh from "./src/components/screens/Splash";
import Home from "./src/components/screens/Home";
import Login from "./src/components/screens/Login";
import Profile from "./src/components/screens/Profile";
import SignUp from "./src/components/screens/SignUp";
import Cart from "./src/components/screens/Cart";
import MyOrders from "./src/components/screens/MyOrders";
import VendorList from "./src/components/screens/VendorList";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { globalStyles } from "./src/components/styles/globalStyles";
import ProductDescription from "./src/components/screens/ProductDescription";
import VendorItems from "./src/components/screens/VendorItems";
import Checkout from "./src/components/screens/Checkout";
import TrackOrder from "./src/components/screens/TrackOrder";
import AddAddress from "./src/components/screens/AddAddress";
import MyAddress from "./src/components/screens/MyAddress";
import OrderInvoice from "./src/components/screens/OrderInvoice";
import firebase from "@react-native-firebase/app";
import OneSignal from "react-native-onesignal";
import OTPverify from "./src/components/screens/OTPverify";
import ResetPassword from "./src/components/screens/ResetPassword";
import PickLocation from "./src/components/screens/PickLocation";
import Verification from "./src/components/screens/Verification";
import GiftWallet from "./src/components/screens/GiftWallet";
import ReferenceBonus from "./src/components/screens/ReferenceBonus";
import Search from "./src/components/screens/Search";
import Restaurant from './src/components/screens/Restaurant';
import PaymentDone from "./src/components/screens/paymentDone";
import ShareScreen from "./src/components/screens/ShareScreen";
import RateDelivery from "./src/components/screens/RateDelivery";
import ReturnProduct from "./src/components/screens/ReturnProduct";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { color } from "react-native-reanimated";
import FilterTest from './src/components/screens/FilterTest';
import ProductCatalog from './src/components/screens/ProductCatalog';
import ExpendComponent from './src/components/screens/ExpendComponent';
import ChipItem from './src/components/screens/ChipItem';
import Tools from './src/components/screens/Tools';
// try {
//   console.log("initilizing oneSignal .......")
//   console.log("oneSignal configs ====  ")

//   OneSignal.init

//   // OneSignal.init('32646516-0d43-4cdd-88c3-6b0e10027f44',
//   //   {
//   //     kOSSettingsKeyAutoPrompt: false,
//   //     kOSSettingsKeyInAppLaunchURL: false,
//   //     kOSSettingsKeyInFocusDisplayOption: 2,
//   //   })
//   console.log("oneSignal initilized successfully .......")

// } catch (err) {
//   console.log("error while initilizing oneSignal ......   ", err)
// }


const firebaseConfig = {
  apiKey: "AIzaSyDqx8IiKbJh-ys10zUYWO7I0tS4f6G0rKA",
  authDomain: "foodapp-ac2f0.firebaseapp.com",
  databaseURL: "https://foodapp-ac2f0-default-rtdb.firebaseio.com",
  projectId: "foodapp-ac2f0",
  storageBucket: "foodapp-ac2f0.appspot.com",
  messagingSenderId: "5879282761",
  appId: "1:5879282761:web:ed5790402a25566860d398",
};


try {
  console.log("initilizing firebase .......");
  console.log("firebase configs ====  ", firebaseConfig);

  // if (!firebase.app.length) {
  //   firebase.initializeApp(firebaseConfig);
  //   console.log("inside if statement  .......")
  // }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }


  // firebase.initializeApp(firebaseConfig);
  console.log("Firebase initilized successfully .......");

} catch (err) {
  console.log("error while initilizing firebase ......   ", err);
}


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar() {
  return (
    <Tab.Navigator initialRouteName="Home"
      labeled={false}
      activeColor="#00aea2"
      tabBarOptions={{
        style: {
          backgroundColor: globalStyles.secondaryThemeColor,
          borderTopColor: globalStyles.secondaryThemeColor,

        },
        activeTintColor: "white",
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name == "Home") {
            iconName = "home-outline";
          } else if (route.name == "Search") {
            iconName = "search";
          } else if (route.name == "Cart") {
            iconName = "cart-outline";
          } else if (route.name == "My Orders") {
            iconName = "briefcase-outline";
          } else if (route.name == "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={wp(5)} color={"gray"} />;
        },
      })}>

      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Cart" component={Cart} options={{ headerShown: true }} />
      <Tab.Screen name="My Orders" component={MyOrders} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>

  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  // async componentDidMount() {
  //   /* O N E S I G N A L   S E T U P */
  //   OneSignal.setAppId("32646516-0d43-4cdd-88c3-6b0e10027f44");
  //   OneSignal.setLogLevel(6, 0);
  //   OneSignal.setRequiresUserPrivacyConsent(false);
  //   OneSignal.promptForPushNotificationsWithUserResponse(response => {
  //     this.OSLog("Prompt response:", response);
  //   });

  //   /* O N E S I G N A L  H A N D L E R S */
  //   OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
  //     this.OSLog("OneSignal: notification will show in foreground:", notifReceivedEvent);
  //     let notif = notifReceivedEvent.getNotification();

  //     const button1 = {
  //       text: "Cancel",
  //       onPress: () => { notifReceivedEvent.complete(); },
  //       style: "cancel"
  //     };

  //     const button2 = { text: "Complete", onPress: () => { notifReceivedEvent.complete(notif); } };

  //     Alert.alert("Complete notification?", "Test", [button1, button2], { cancelable: true });
  //   });
  //   OneSignal.setNotificationOpenedHandler(notification => {
  //     this.OSLog("OneSignal: notification opened:", notification);
  //   });
  //   OneSignal.setInAppMessageClickHandler(event => {
  //     this.OSLog("OneSignal IAM clicked:", event);
  //   });
  //   OneSignal.addEmailSubscriptionObserver((event) => {
  //     this.OSLog("OneSignal: email subscription changed: ", event);
  //   });
  //   OneSignal.addSubscriptionObserver(event => {
  //     this.OSLog("OneSignal: subscription changed:", event);
  //     this.setState({ isSubscribed: event.to.isSubscribed })
  //   });
  //   OneSignal.addPermissionObserver(event => {
  //     this.OSLog("OneSignal: permission changed:", event);
  //   });

  //   const deviceState = await OneSignal.getDeviceState();

  //   this.setState({
  //     isSubscribed: deviceState.isSubscribed
  //   });
  // }

  render() {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={"Splash"}
            screenOptions={{
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: globalStyles.secondaryThemeColor,
              },
            }}>
            <Stack.Screen name="Splash" component={Spalsh} options={{
              headerShown: false,
            }} />

            <Stack.Screen name="PickLocation" component={PickLocation} options={{
              headerShown: false,
            }} />
            <Stack.Screen name="AddAddress" component={AddAddress} options={{
              headerShown: false,
            }}
            />
            <Stack.Screen name="Homes" component={Home} options={{
              headerShown: false,
            }}
            />

            <Stack.Screen name="Home" component={TabBar} options={{
              headerShown: false,
              headerLeft: null,
              headerStyle: { elevation: 0.3 },
              headerRight: () => (
                <View style={{ flexDirection: "row", width: wp("25%"), marginRight: wp(4) }}>
                  {/* <EntypoIcon name={'shopping-cart'} size={20} /> */}
                  <Ionicons name={"location-outline"} size={23} />
                  <Ionicons name={"search-outline"} size={23} />
                  <Ionicons name={"cart-outline"} size={23} style={{ marginLeft: wp(10) }} />
                </View>
              ),

            }} />

            <Stack.Screen name="OTPverify" component={OTPverify}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen name="ReferenceBonus" component={ReferenceBonus} />
            <Stack.Screen name="GiftWallet" component={GiftWallet} />


            <Stack.Screen name="Verification" component={Verification}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="SignUp" component={SignUp}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Login" component={Login}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen name="MyAddress" component={MyAddress} options={{
              headerShown: false,
            }} />

            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ResetPassword" component={ResetPassword}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Search" component={Search} options={{
              headerShown: false,
            }} />
            <Stack.Screen name="Restaurant" component={Restaurant} options={{
              headerShown: false,
            }} />
            <Stack.Screen name="Near by vendors" component={VendorList} />
            <Stack.Screen name="ShareScreen" component={ShareScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Product Description" component={ProductDescription}  options={{
                headerTintColor:"white",
                headerTransparent:true,
                headerTitle:"",
                headerRight:() =>(<View style={{flexDirection:'row',justifyContent:'space-between',width:wp(18),marginHorizontal:wp(4)}}>
                <View style={{height:hp(4),width:wp(8.5),borderRadius:wp(10),backgroundColor:'rgba(255,255,255, 0.5)',justifyContent:'center',alignItems:'center'}}>
                <AntDesign name={"hearto"} color="white" size={wp(5)} />
                </View>
                <View style={{height:hp(4),width:wp(8.5),borderRadius:wp(10),backgroundColor:'rgba(255,255,255, 0.5)',justifyContent:'center',alignItems:'center'}}>
                 <Entypo name={"link"} color="white" size={wp(5)} />
                 </View>
                 </View>)
                  
              }} />
            <Stack.Screen name="Menu" component={VendorItems} />
            <Stack.Screen name="Order Details" component={Checkout} />
            <Stack.Screen name="Track Order" component={TrackOrder} />
            <Stack.Screen name="Order Invoice" component={OrderInvoice} />
            <Stack.Screen name="Order Placed" component={PaymentDone} />
            <Stack.Screen name="MyOrders" component={MyOrders}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="RateDelivery" component={RateDelivery}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="ReturnProduct" component={ReturnProduct}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen name="Cart" component={Cart}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="FilterTest" component={FilterTest}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="ProductCatalog" component={ProductCatalog}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="ExpendComponent" component={ExpendComponent}
              options={{
                headerShown: false,
              }}
            />
             <Stack.Screen name="ChipItem" component={ChipItem}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Tools" component={Tools}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
