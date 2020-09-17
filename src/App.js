import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Weather from './components/Weather';

import WeatherState from './context/weather/WeatherState';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <WeatherState>
      <StatusBar backgroundColor="#5d54a4" />
      <SafeAreaView style={styles.container}>
        <Weather />
      </SafeAreaView>
    </WeatherState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
