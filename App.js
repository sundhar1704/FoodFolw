import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { COLORS } from './src/constants/theme';
import { getIsLoggedIn } from './src/utils/authStorage';
import { CartProvider } from './src/context/CartContext';

// Screens
import Splash from './src/screens/Splash';
import Onboarding1 from './src/screens/Onboarding1';
import Onboarding2 from './src/screens/Onboarding2';
import Onboarding3 from './src/screens/Onboarding3';
import Login from './src/screens/Login';
import SocialAuth from './src/screens/SocialAuth';
import Home from './src/screens/Home';
import Payment from './src/screens/Payment';
import CardPayment from './src/screens/CardPayment';
import PaymentSuccessful from './src/screens/PaymentSuccessful';
import OrderTracking from './src/screens/OrderTracking';
import Orders from './src/screens/Orders';
import Cart from './src/context/Cart';
import ProductDetail from './src/screens/ProductDetail';
import Profile from './src/screens/Profile';
import Checkout from './src/screens/Checkout';
import { FavoritesProvider } from './src/context/FavoritesContext';
import Favorites from './src//screens/Favorites';

const Stack = createNativeStackNavigator();

// ---------------------------------------------------------------------
// DEV TOGGLE: while we're still building/reviewing screens, set this to
// true so every app launch always shows the full
// Splash → Onboarding → Login flow, regardless of any saved session.
//
// Once the app is finished and ready for real use, set this to false —
// a returning logged-in user will then skip straight to Home again
// (the session-persistence code itself is unchanged either way).
// ---------------------------------------------------------------------
const ALWAYS_SHOW_FULL_FLOW = true;

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // null = still checking, true/false = known
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    getIsLoggedIn().then(setIsLoggedIn);
  }, []);

  if (!fontsLoaded || isLoggedIn === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const effectiveIsLoggedIn = ALWAYS_SHOW_FULL_FLOW ? false : isLoggedIn;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <CartProvider>
        <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={effectiveIsLoggedIn ? 'Home' : 'Splash'}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding1" component={Onboarding1} />
            <Stack.Screen name="Onboarding2" component={Onboarding2} />
            <Stack.Screen name="Onboarding3" component={Onboarding3} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SocialAuth" component={SocialAuth} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="CardPayment" component={CardPayment} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessful} />
            <Stack.Screen name="OrderTracking" component={OrderTracking} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Favorites" component={Favorites} />
          </Stack.Navigator>
        </NavigationContainer>
        </FavoritesProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}