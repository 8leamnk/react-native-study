import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';

import weatherData from './weather.json';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Temp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

interface KeyValue {
  [key: string]: string | number | KeyValue | Temp | Weather[];
}

interface Daily extends KeyValue {
  temp: Temp;
  weather: Weather[];
}

export default function RootLayout() {
  const [consent, setConsent] = useState<boolean>(false);
  const [city, setCity] = useState<string>('Loaging...');
  const [district, setDistrict] = useState<string>('');
  const [days, setDays] = useState<Daily[]>([]);

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    return granted;
  };

  const getCoords = async () => {
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    return coords;
  };

  const getLocation = async (latitude: number, longitude: number) => {
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    return location[0];
  };

  const saveStateOfLocation = async (
    location: Location.LocationGeocodedAddress,
  ) => {
    setConsent(true);
    setCity(location.city || '');
    setDistrict(location.district || '');
  };

  const getWeather = async (_latitude: number, _longitude: number) => {
    setDays(weatherData.daily);
  };

  const fetchData = async () => {
    const granted = await ask();

    if (granted) {
      const { latitude, longitude } = await getCoords();
      const location = await getLocation(latitude, longitude);

      saveStateOfLocation(location);
      await getWeather(latitude, longitude);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.districtName}>{district}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>{day.temp.day.toFixed(1)}</Text>
              <Text style={styles.main}>{day.weather[0].main}</Text>
              <Text style={styles.description}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 64,
    fontWeight: 500,
  },
  districtName: {
    fontSize: 32,
    fontWeight: 500,
    marginTop: 16,
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    marginTop: 56,
    fontSize: 160,
  },
  main: {
    fontSize: 64,
    marginTop: -16,
  },
  description: {
    fontSize: 24,
  },
});
