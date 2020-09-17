import React, {useReducer} from 'react';
import axios from 'axios';

import {API_KEY} from '@env';
import WeatherContext from './WeatherContext';
import WeatherReducer from './WeatherReducer';
import {
  GET_CURRENT_BY_CITY_SUCCESS,
  GET_CURRENT_BY_CITY_FAIL,
  GET_CURRENT_BY_GPS_SUCCESS,
  GET_CURRENT_BY_GPS_FAIL,
  GET_DAILY_FAIL,
  GET_DAILY_SUCCESS,
  CLEAR_ERROR,
} from '../types';

const WeatherState = (props) => {
  const initialState = {
    currentWeather: null,
    daily: [],
    loading: true,
    error: null,
    location: null,
  };

  const [state, dispatch] = useReducer(WeatherReducer, initialState);

  // Get weather by city name
  const weatherByCity = async (city = 'London') => {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
      const res = await axios.get(API_URL);

      dispatch({
        type: GET_CURRENT_BY_CITY_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_CURRENT_BY_CITY_FAIL,
        payload: error.response.data.cod,
      });
    }
  };

  // Get daily forecast
  const getDaily = async (coords) => {
    const API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&
    exclude=minutely,hourly&units=metric&appid=${API_KEY}`;

    try {
      const res = await axios.get(API_URL);

      let daily = await res.data.daily.slice(1);

      daily.pop();
      daily.pop();

      dispatch({
        type: GET_DAILY_SUCCESS,
        payload: daily,
      });
    } catch (error) {
      dispatch({
        type: GET_DAILY_FAIL,
        payload: error.response.data.cod,
      });
    }
  };

  // Get weather by GPS
  const getWeatherByGPS = async (coords) => {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;

    try {
      const res = await axios.get(API_URL);

      dispatch({
        type: GET_CURRENT_BY_GPS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GET_CURRENT_BY_GPS_FAIL,
        payload: error.response.data.cod,
      });
    }
  };

  // Clear error
  const clearError = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ERROR,
      });
    }, 3000);
  };

  return (
    <WeatherContext.Provider
      value={{
        currentWeather: state.currentWeather,
        daily: state.daily,
        loading: state.loading,
        error: state.error,
        location: state.location,
        weatherByCity,
        getWeatherByGPS,
        getDaily,
        clearError,
      }}>
      {props.children}
    </WeatherContext.Provider>
  );
};

export default WeatherState;
