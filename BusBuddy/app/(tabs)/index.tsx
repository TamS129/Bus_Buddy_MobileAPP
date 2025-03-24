import React, { useState, useEffect } from 'react';
import MapView, { Region } from 'react-native-maps';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import BusStopMarker from '../../components/BusMarker';
import * as Location from 'expo-location';


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
    setLoading(true);
    try {
      if (region) {
      const query = `
       SELECT *
       FROM stops
       WHERE ST_Distance_Sphere(
       POINT(stop_lon, stop_lat),
       POINT(${region.longitude}, ${region.latitude})
        ) <= 1000;
       `;

      const response = await fetch('http://db.scholomance.io:2501/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          },
        body: JSON.stringify({ 
        query
        }),
       });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
          
       const data = await response.json();
       console.log('Response received:', data);
       setStops(data); 
      }      
    } catch (error) {
      
      Alert.alert('Error', 'Failed to load stops.');
    } finally {
      setLoading(false);
    }
  }

  //This function handles the marker locations for the bus stop. TODO: Replace with placeholder bus route schdueler
  const handleMarkerPress = (stopID: string) => {

    Alert.alert('Stop Selected', `Stop ID: ${stopID}`, [ //Replace with BusSchduele.tsx

      { text: 'OK', onPress: () => console.log('OK Pressed') }, //Console.log to make sure the onPress is working....
    ]);
  };

  return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : region ? (
          <MapView style={styles.map} initialRegion={region}>
            {stops.map((stop) => (
              <BusStopMarker
                key={String(stop.id)} 
                stopID={stop.id}
                stopName={stop.stop_name}
                latitude={parseFloat(stop.stop_lat)}
                longitude={parseFloat(stop.stop_lon)}
                onPress={() => handleMarkerPress(stop.stop_name)}
                pinColor="#2DAEC5"
              />
            ))}
          </MapView>
        ) : null}
        {/* {selectedStop && (
          <BusSchduele stopName={selectedStop.stop_name} onClose={closeSchedule}>
            {stopTimes.map((time, index) => (
              <Text key={index}>
                Arrival: {time.arrival_time}, Departure: {time.departure_time}
              </Text>
            ))}
          </BusSchduele> */}
        {/* )} */}
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