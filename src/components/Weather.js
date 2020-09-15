import React, {useState, useRef, useContext, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

import WeatherContext from '../context/weather/WeatherContext';

const Weather = () => {
  const weatherContext = useContext(WeatherContext);

  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const {
    currentWeather,
    getCurrentWeather,
    loading,
    error,
    clearError,
  } = weatherContext;

  const ref = useRef();

  useEffect(() => {
    getCurrentWeather();
  }, []);

  const submit = () => {
    if (inputValue !== '') {
      if (inputValue.match(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/)) {
        getCurrentWeather(inputValue);
      } else {
        Alert.alert('Oops', 'Please include valid city name');
      }
    }

    setShowInput(false);
    ref.current.bounceIn();
    setInputValue('');
  };

  const displayInput = () => {
    setShowInput(true);
    ref.current.bounceIn();
  };

  if (error) {
    if (error === 401 || error === 429) {
      Alert.alert('Oops', 'Something went wrong');
      clearError();
    }

    if (error === '404') {
      Alert.alert('Oops', 'City not found');
      clearError();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Animatable.View
          animation="bounceInRight"
          duration={1000}
          style={styles.header}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="near-me" size={30} color="#fff" />
          </TouchableOpacity>
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {showInput ? (
              <Animatable.View
                ref={ref}
                style={{width: '100%'}}
                animation="bounceIn"
                duration={1000}>
                <TextInput
                  style={styles.input}
                  textAlignVertical="center"
                  textAlign="center"
                  selectionColor="#dedede"
                  returnKeyType="search"
                  value={inputValue}
                  onChangeText={(text) => setInputValue(text)}
                  autoFocus={showInput ? true : false}
                  onEndEditing={submit}
                />
              </Animatable.View>
            ) : (
              <Animatable.View
                ref={ref}
                style={{width: '100%'}}
                animation="bounceIn"
                duration={1000}>
                {currentWeather ? (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      textAlign: 'center',
                    }}>
                    {currentWeather.city}
                  </Text>
                ) : null}
              </Animatable.View>
            )}
          </View>
          <TouchableOpacity
            onPress={showInput ? submit : displayInput}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name={showInput ? 'done' : 'search'} size={30} color="#fff" />
          </TouchableOpacity>
        </Animatable.View>
      </View>

      {loading || error ? (
        <View style={styles.loading}>
          <ActivityIndicator
            style={{transform: [{scale: 1.5}]}}
            size="large"
            color="#fff"
          />
        </View>
      ) : (
        <View style={styles.bottomContainer}>
          <View style={styles.iconContainer}>
            {currentWeather ? (
              <Text style={{textAlign: 'center', fontSize: 30, color: '#fff'}}>
                {currentWeather.weather.description}, {currentWeather.temp}°
              </Text>
            ) : null}
            {error ? <Text>{error}</Text> : null}
          </View>
          <View style={styles.tempContainer}>
            {loading ? <Text>loading</Text> : <Text>not loading</Text>}
          </View>
          <View style={styles.forecastContainer}>
            <Text>Forecast</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bb79a2',
    paddingTop: StatusBar.currentHeight || 10,
  },
  loading: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
  },
  bottomContainer: {
    flex: 7,
  },
  header: {
    flexDirection: 'row',
    flex: 1,
  },
  input: {
    height: 50,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    width: '100%',
    fontSize: 20,
    color: '#fff',
  },
  iconContainer: {
    flex: 3,
  },
  tempContainer: {
    flex: 2,
  },
  forecastContainer: {
    flex: 5,
  },
});

export default Weather;
