import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapView, { Region } from 'react-native-maps';
import { StyleSheet, View, Alert, ActivityIndicator, Text } from 'react-native'; 
import BusStopMarker from '../../components/BusMarker';
import BusSchduele from '../../components/BusSchduele';
import menu from '../../components/menu';
import * as Location from 'expo-location';
import axios from 'axios';
import debounce from 'lodash.debounce';
import UserProfile from '@/components/UserProfile';
import Menu from '../../components/menu';

//Interface to use the stops globally throught the functions for the map.
interface Stop {
    id: string;
    stop_id: number; 
    stop_name: string;
    stop_lat: string;
    stop_lon: string;
}

export default function App() {
  //States for stops, Region tracking, debounding/reloading the markers on the app, and states for stoptimes.
    const [stops, setStops] = useState<Stop[]>([]);
    const [region, setRegion] = useState<Region | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMoving, setIsMoving] = useState(false);
    const lastRegion = useRef<Region | null>(null);
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [stopTimes, setStopTimes] = useState<any[]>([]);

    useEffect(() => {
      //Function that has the map set the beginning location to user current location.  
      (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            //Generates the current region where the user is located. 
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

    //API fetch function that gathers the stops within the region. distance is calculated to only load markers within a specfic region.
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
            
            const res = await axios.post('http://db.scholomance.io:2501/api/stops/query', { query: query });
            setStops(res.data);
        } 
        catch (error) {
            console.error('Error fetching stops:', error);
            Alert.alert('Error', 'Failed to load stops.');
        } 
        finally {
            setLoading(false);
        }
    }

    //imported debouncer implemented to make the transistion between regions (somewhat) smoother and less laggy. Sets a timeer for when the users STOPS and then reloads.
    const debouncedFetchStops = useRef(debounce((newRegion: Region) => {
        requestAnimationFrame(() => {
            fetchStops(newRegion);
        });
    }, 800)).current;

    //Tries not to load too many markers before the user is settled on a location. 
    const handleRegionChange = useCallback((newRegion: Region) => {
        setIsMoving(true);
    }, []);

    //When the user stops moving then the markers load in. It's not the best solution but it allows the user to not be zig zagged around when scrolling.
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
                Math.pow(roundedRegion.latitude - lastRegion.current.latitude, 2) +
                Math.pow(roundedRegion.longitude - lastRegion.current.longitude, 2)
            );

            if (distance > 0.002) {
                setRegion(roundedRegion);
                debouncedFetchStops(roundedRegion);
                lastRegion.current = roundedRegion;
            }
        } 
        else {
            setRegion(roundedRegion);
            debouncedFetchStops(roundedRegion);
            lastRegion.current = roundedRegion;
        }
    }, [debouncedFetchStops]);

    //Handles when the user presses the bus stop marker.
    const handleMarkerPress = async (stopID: number) => { 
        const stop = stops.find((s) => s.stop_id === stopID); 
        if (stop) {
            setSelectedStop(stop);
            await fetchStopTimes(stop.stop_id); 
        }
    };

    //API call for the stops times, it displays it to the Buscheduler component.
    const fetchStopTimes = async (stopID: number) => { // Changed stopID type
        setLoading(true);
        
        try {
            const query = `
                SELECT arrival_time, departure_time
                FROM stop_times
                WHERE stop_id = ${stopID}
                ORDER BY arrival_time
            `;

            const res = await axios.post('http://db.scholomance.io:2501/api/stop_times/query', { query: query });
            setStopTimes(res.data);
        } 
        catch (error) {
            console.error('Error fetching stop times:', error);
            Alert.alert('Error', 'Failed to load schedule.');
        } 
        finally {
            setLoading(false);
        }
    };

    //Handles closing the schdueler.
    const closeSchedule = () => {
        setSelectedStop(null);
        setStopTimes([]);
    };

    const menuItems = [
      { label: 'Settings', onPress: () => Alert.alert('Settings') }
    ];

    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <Menu items={menuItems} />
        </View>
    
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : region ? (
          <MapView
            style={styles.map}
            initialRegion={region}
            onRegionChange={handleRegionChange}
            onRegionChangeComplete={handleRegionChangeComplete}
            testID="map-view"
          >
            {stops.map((stop) => (
              <BusStopMarker
                key={stop.id ? String(stop.id) : String(Math.random())}
                stopID={stop.stop_id}
                stopName={stop.stop_name}
                latitude={parseFloat(stop.stop_lat)}
                longitude={parseFloat(stop.stop_lon)}
                onPress={() => handleMarkerPress(stop.stop_id)}
                pinColor="#2DAEC5"
              />
            ))}
          </MapView>
        ) : null}
    
    {selectedStop && (
      <BusSchduele stopName={selectedStop.stop_name} onClose={closeSchedule}>
      <View style={styles.busSchedule}> 
        {stopTimes.map((time, index) => (
          <Text key={index}>
            Arrival: {time.arrival_time}, Departure: {time.departure_time}
          </Text>
        ))}
      </View>
      </BusSchduele>
)}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    position: 'absolute', 
    top: 10,
    right: 10,
    zIndex: 1000, 
  },
  busSchedule: {
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white', 
    padding: 10, 
    zIndex: 1,  
  },
});