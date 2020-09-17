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
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

import WeatherContext from '../context/weather/WeatherContext';
import ListItem from './ListItem';

const Weather = () => {
  const weatherContext = useContext(WeatherContext);

  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const {
    currentWeather,
    weatherByCity,
    loading,
    error,
    clearError,
    daily,
    location,
    getDaily,
    getWeatherByGPS,
  } = weatherContext;

  const ref = useRef();

  useEffect(() => {
    if (error) {
      if (error === 401 || error === 429 || error === 400) {
        Alert.alert('Oops', 'Something went wrong');
      } else {
        Alert.alert('Oops', 'City not found');
      }

      clearError();
    } else {
      getData();
    }
  }, [error, loading]);

  const getDailyWeather = () => {
    if (!loading && !error) {
      getDaily(location);
    }
  };

  const getData = async () => {
    try {
      const city = await AsyncStorage.getItem('city');
      if (city !== null) {
        weatherByCity(city);
      } else {
        weatherByCity();
      }

      getDailyWeather();
    } catch (error) {
      console.log(error);
    }
  };

  const submitGPS = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'gWeather needs access to your location in order to use this function',
          buttonNeutral: 'Ask Me later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Ok',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          async (position) => {
            getWeatherByGPS({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            getDailyWeather();
          },
          (error) => {
            // See error code charts below.
            if (error.code === 1 || error.code === 2 || error.code === 3) {
              Alert.alert('Oops', `${error.code}`);
            } else {
              Alert.alert('Oops', 'Something went wrong...');
            }
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        Alert.alert(
          'Location permission denied',
          'In order to use this function please turn on location permission for this app.',
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submit = () => {
    if (inputValue !== '') {
      if (inputValue.match(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/)) {
        weatherByCity(inputValue);
        getDailyWeather();
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

  function WeatherIcon() {
    if (currentWeather.weather[0]) {
      const weatherId = currentWeather.weather[0].id.toString();

      if (weatherId.startsWith(2)) {
        return <MaterialIcon name="weather-lightning" size={70} color="#fff" />;
      } else if (weatherId.startsWith(3)) {
        return <MaterialIcon name="weather-rainy" size={70} color="#fff" />;
      } else if (weatherId.startsWith(5)) {
        return <MaterialIcon name="weather-pouring" size={70} color="#fff" />;
      } else if (weatherId.startsWith(6)) {
        return <MaterialIcon name="weather-snowy" size={70} color="#fff" />;
      } else if (weatherId.startsWith(7)) {
        return <MaterialIcon name="weather-fog" size={70} color="#fff" />;
      } else if (currentWeather.weather[0].icon === '01d') {
        return <MaterialIcon name="weather-sunny" size={70} color="#fff" />;
      } else if (currentWeather.weather[0].icon === '01n') {
        return <MaterialIcon name="weather-night" size={70} color="#fff" />;
      } else if (weatherId.startsWith(8)) {
        return <MaterialIcon name="weather-cloudy" size={70} color="#fff" />;
      } else
        return <MaterialIcon name="weather-sunny" size={70} color="#fff" />;
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
            onPress={submitGPS}
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
                    {currentWeather.name}
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
          <Animatable.View
            duration={1000}
            animation="fadeIn"
            style={styles.iconContainer}>
            {currentWeather ? <WeatherIcon /> : null}
          </Animatable.View>
          <Animatable.View
            duration={1000}
            animation="fadeIn"
            style={styles.tempContainer}>
            {currentWeather ? (
              <Text style={{textAlign: 'center', fontSize: 25, color: '#fff'}}>
                {currentWeather.weather[0].description.charAt(0).toUpperCase() +
                  currentWeather.weather[0].description.slice(1)}
                , {currentWeather.main.temp}°
              </Text>
            ) : null}
          </Animatable.View>
          <View style={styles.forecastContainer}>
            {daily.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={daily}
                keyExtractor={(item) => item.dt.toString()}
                renderItem={({item, index}) => {
                  return <ListItem item={item} index={index} />;
                }}
              />
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5d54a4',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    // backgroundColor: 'green',
  },
  tempContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 10,
    // backgroundColor: 'blue',
  },
  forecastContainer: {
    flex: 5,
    marginTop: 10,
    // backgroundColor: 'red',
  },
});

export default Weather;
