import { useEffect, useState } from 'react';
import {
  LocationGeocodedAddress,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  reverseGeocodeAsync,
} from 'expo-location';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationGeocodedAddress[]>([]);
  const [isPermission, setIsPermission] = useState(true);
  const [city, setCity] = useState('Loading...');

  const getPermission = async () => {
    const { granted } = await requestForegroundPermissionsAsync();

    if (!granted) {
      setIsPermission(false);
    }

    return granted;
  };

  const getPosition = async () => {
    const {
      coords: { latitude, longitude },
    } = await getCurrentPositionAsync({ accuracy: 5 });

    return { latitude, longitude };
  };

  const getLocation = async (latitude: number, longitude: number) => {
    const location = await reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false },
    );

    setLocation(location);

    return location[0];
  };

  const getCity = async () => {
    const granted = await getPermission();

    if (granted) {
      const { latitude, longitude } = await getPosition();
      const location = await getLocation(latitude, longitude);

      if (location && location.city) {
        setCity(location.city);
      } else {
        setCity('Error');
      }
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    console.log('city', city);
  }, [city]);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
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
          <Text style={styles.temp}>28</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>

        <View style={styles.day}>
          <Text style={styles.temp}>29</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.tint,
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 64,
    fontWeight: '600',
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    fontSize: 176,
    fontWeight: '600',
    marginTop: 48,
  },
  description: {
    fontSize: 56,
    marginTop: -24,
  },
});
