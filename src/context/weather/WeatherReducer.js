import {
  CLEAR_ERROR,
  GET_CURRENT_BY_CITY_FAIL,
  GET_CURRENT_BY_CITY_SUCCESS,
  GET_CURRENT_BY_GPS_FAIL,
  GET_CURRENT_BY_GPS_SUCCESS,
  GET_DAILY_SUCCESS,
  GET_DAILY_FAIL,
} from '../types';

import AsyncStorage from '@react-native-community/async-storage';

export default (state, action) => {
  switch (action.type) {
    case GET_CURRENT_BY_CITY_SUCCESS:
    case GET_CURRENT_BY_GPS_SUCCESS:
      AsyncStorage.setItem('city', action.payload.name);
      return {
        ...state,
        daily: [],
        currentWeather: action.payload,
        location: {
          lat: action.payload.coord.lat,
          lon: action.payload.coord.lon,
        },
        loading: false,
      };
    case GET_DAILY_SUCCESS:
      return {
        ...state,
        daily: action.payload,
        loading: false,
      };
    case GET_CURRENT_BY_CITY_FAIL:
    case GET_CURRENT_BY_GPS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case GET_DAILY_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
