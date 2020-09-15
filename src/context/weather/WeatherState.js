import React, {useReducer} from 'react';
import axios from 'axios';

import {API_KEY} from '@env';
import WeatherContext from './WeatherContext';
import WeatherReducer from './WeatherReducer';
import {GET_CURRENT_FAIL, GET_CURRENT_SUCCESS, CLEAR_ERROR} from '../types';

const WeatherState = (props) => {
  const initialState = {
    currentWeather: null,
    dailyForecast: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(WeatherReducer, initialState);

  // Get Current Weather
  const getCurrentWeather = async (city = 'London') => {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
      const res = await axios.get(API_URL);

      let weather = {
        city: res.data.name,
        weather: {
          description:
            res.data.weather[0].description.charAt(0).toUpperCase() +
            res.data.weather[0].description.slice(1),
          icon: `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
        },
        temp: res.data.main.temp,
      };

      dispatch({
        type: GET_CURRENT_SUCCESS,
        payload: weather,
      });
    } catch (error) {
      dispatch({
        type: GET_CURRENT_FAIL,
        payload: error.response.data.cod,
      });
    }
  };

  const clearError = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ERROR,
      });

      getCurrentWeather();
    }, 3000);
  };

  // Get 5 day forecast

  return (
    <WeatherContext.Provider
      value={{
        currentWeather: state.currentWeather,
        dailyForecast: state.dailyForecast,
        loading: state.loading,
        error: state.error,
        getCurrentWeather,
        clearError,
      }}>
      {props.children}
    </WeatherContext.Provider>
  );
};

export default WeatherState;
