import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const WEATHER_API_KEY = '123456789';

export default function RootLayout() {
  const [consent, setConsent] = useState<boolean>(false);
  const [city, setCity] = useState<string>('Loaging...');
  const [district, setDistrict] = useState<string>('');
  const [days, setDays] = useState([]);

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

  const getWeather = async (latitude: number, longitude: number) => {
    // const response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=${WEATHER_API_KEY}`,
    // );
    // const json = await response.json();
  };

  useEffect(() => {
    async function fetchData() {
      const granted = await ask();

      if (granted) {
        const { latitude, longitude } = await getCoords();
        const location = await getLocation(latitude, longitude);

        saveStateOfLocation(location);
        await getWeather(latitude, longitude);
      }
    }

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
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
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
  description: {
    marginTop: -16,
    fontSize: 64,
  },
});
