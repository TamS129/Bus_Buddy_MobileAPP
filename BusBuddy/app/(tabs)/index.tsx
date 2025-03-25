import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapView, { Region } from 'react-native-maps';
import { StyleSheet, View, Alert, ActivityIndicator, Text } from 'react-native';
import BusStopMarker from '../../components/BusMarker';
import * as Location from 'expo-location';
import axios from 'axios';
import debounce from 'lodash.debounce';
import BusSchduele from '../../components/BusSchduele'; // Import the schedule component

interface Stop {
  id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
}

export default function App() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const lastRegion = useRef<Region | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [stopTimes, setStopTimes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const generatedRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(generatedRegion);
      fetchStops(generatedRegion);
    })();
  }, []);

  async function fetchStops(region: Region | null) {
    if (!region) return;
    setLoading(true);

    try {
      const distance = Math.max(region.latitudeDelta, region.longitudeDelta) * 100000;
      const query = `
        SELECT *
        FROM stops
        WHERE ST_Distance_Sphere(POINT(stop_lon, stop_lat), POINT(${region.longitude}, ${region.latitude})) <= ${distance};
      `;
      console.log('Sending Query:', query);
      const res = await axios.post('http://db.scholomance.io:2501/api/stops/query', { query: query });
      setStops(res.data);
    } catch (error) {
      console.error('Error fetching stops:', error);
      Alert.alert('Error', 'Failed to load stops.');
    } finally {
      setLoading(false);
    }
  }

  const fetchStopTimes = async (stopID: string) => {
    try {
      const query = `
        SELECT arrival_time, departure_time
        FROM stop_times
        WHERE stop_id = '${stopID}';
      `;
      console.log('Sending Query:', query);
      const res = await axios.post('http://db.scholomance.io:2501/api/stop_times/query', { query: query });
      setStops(res.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load schduele.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchStops = useRef(debounce((newRegion: Region) => {
    requestAnimationFrame(() => {
      fetchStops(newRegion);
    });
  }, 800)).current;

  const handleRegionChange = useCallback((newRegion: Region) => {
    setIsMoving(true);
  }, []);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setIsMoving(false);
    const roundedRegion = {
      latitude: Math.round(newRegion.latitude * 10000) / 10000,
      longitude: Math.round(newRegion.longitude * 10000) / 10000,
      latitudeDelta: Math.round(newRegion.latitudeDelta * 1000) / 1000,
      longitudeDelta: Math.round(newRegion.longitudeDelta * 1000) / 1000,
    };

    if (lastRegion.current) {
      const distance = Math.sqrt(
        Math.pow(roundedRegion.latitude - lastRegion.current.latitude, 2) + Math.pow(roundedRegion.longitude - lastRegion.current.longitude, 2)
      );
      if (distance > 0.002) {
        setRegion(roundedRegion);
        debouncedFetchStops(roundedRegion);
        lastRegion.current = roundedRegion;
      }
    } else {
      setRegion(roundedRegion);
      debouncedFetchStops(roundedRegion);
      lastRegion.current = roundedRegion;
    }
  }, [debouncedFetchStops]);

  const handleMarkerPress = async (stopID: string, stopName: string) => {
    const stop = stops.find((s) => s.id === stopID);
    if (stop) {
      setSelectedStop(stop);
      setLoading(true);
      try {
        await fetchStopTimes(stopID);
      } catch (error) {
        console.error('Error fetching stop times:', error);
        Alert.alert('Error', 'Failed to load stop times.');
      } finally {
        setLoading(false);
      }
    }
  };

  const closeSchedule = () => {
    setSelectedStop(null);
    setStopTimes([]);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : region ? (
        <MapView
          style={styles.map}
          initialRegion={region}
          onRegionChange={handleRegionChange}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {stops.map((stop) => (
            <BusStopMarker
              key={stop.id ? String(stop.id) : String(Math.random())}
              stopID={stop.id}
              stopName={stop.stop_name}
              latitude={parseFloat(stop.stop_lat)}
              longitude={parseFloat(stop.stop_lon)}
              onPress={() => handleMarkerPress(stop.id, stop.stop_name)}
              pinColor="#2DAEC5"
            />
          ))}
        </MapView>
      ) : null}
      {selectedStop && (
        <BusSchduele stopName={selectedStop.stop_name} onClose={closeSchedule}>
          {stopTimes.map((time, index) => (
            <Text key={index}>
              Arrival: {time.arrival_time}, Departure: {time.departure_time}
            </Text>
          ))}
        </BusSchduele>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});