import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

const ListItem = ({item, index}) => {
  const date = new Date(item.dt * 1000);

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDay = days[date.getDay()];

  const month = months[date.getMonth()];

  function WeatherIcon() {
    if (item.weather[0].id.toString().startsWith(2)) {
      return <MaterialIcon name="weather-lightning" size={40} color="#fff" />;
    } else if (item.weather[0].id.toString().startsWith(3)) {
      return <MaterialIcon name="weather-rainy" size={40} color="#fff" />;
    } else if (item.weather[0].id.toString().startsWith(5)) {
      return <MaterialIcon name="weather-pouring" size={40} color="#fff" />;
    } else if (item.weather[0].id.toString().startsWith(6)) {
      return <MaterialIcon name="weather-snowy" size={40} color="#fff" />;
    } else if (item.weather[0].id.toString().startsWith(7)) {
      return <MaterialIcon name="weather-fog" size={40} color="#fff" />;
    } else if (item.weather[0].icon === '01d') {
      return <MaterialIcon name="weather-sunny" size={40} color="#fff" />;
    } else if (item.weather[0].icon === '01n') {
      return <MaterialIcon name="weather-night" size={40} color="#fff" />;
    } else if (item.weather[0].id.toString().startsWith(8)) {
      return <MaterialIcon name="weather-cloudy" size={40} color="#fff" />;
    }
  }

  return (
    <Animatable.View
      delay={(index + 1) * 500}
      duration={1000}
      animation="bounceInUp"
      style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.weekDay}>{weekDay}</Text>
        <Text
          style={
            styles.fullDate
          }>{`${date.getDate()} ${month}, ${date.getFullYear()}`}</Text>
      </View>
      <View style={styles.tempContainer}>
        <Text style={styles.tempText}>{item.temp.day}°</Text>
        <WeatherIcon />
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  weekDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullDate: {
    fontSize: 15,
    color: '#BABABA',
  },
  tempContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempText: {
    fontSize: 18,
    color: '#fff',
    paddingRight: 15,
  },
});

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ListItem;
