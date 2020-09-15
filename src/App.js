import React, {useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import Weather from './components/Weather';

import WeatherState from './context/weather/WeatherState';

const App = () => {
  return (
    <WeatherState>
      <StatusBar backgroundColor="#bb79a2" />
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