import {GET_CURRENT_FAIL, GET_CURRENT_SUCCESS, CLEAR_ERROR} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_CURRENT_SUCCESS:
      return {
        ...state,
        currentWeather: action.payload,
        loading: false,
      };
    case GET_CURRENT_FAIL:
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
