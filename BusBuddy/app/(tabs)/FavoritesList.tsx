import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import BusScheduele from '../../components/BusSchduele';
import { useFocusEffect } from '@react-navigation/native';

interface Favorite {
  stop_id: number;
  stop_name: string;
}

interface ScheduleItem {
  stop_id: number;
  arrival_time: string;
  route_short_name: string;
}

const FavoriteStops = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFavorite, setSelectedFavorite] = useState<Favorite | null>(null);
  const [busScheduleData, setBusScheduleData] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const fetchFavorites = async () => {
    try {
      const uuid = await SecureStore.getItemAsync('secure_deviceid');
      if (!uuid) {
        console.error('No user found, please add a favorite first.');
        setLoading(false);
        return;
      }
      const res = await axios.post('http://db.scholomance.io:2501/api/favorites/query', {
        query: `SELECT s.stop_id, s.stop_name 
                FROM stops s 
                INNER JOIN favorites f ON s.stop_id = f.stop_id 
                WHERE f.userID = '${uuid}'`
      });
      setFavorites(res.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh favorites whenever the screen comes into focus.
  useFocusEffect(
      React.useCallback(() => {
        setLoading(true);
        fetchFavorites();
      }, [])
  );

  // When a favorite is selected, fetch its schedule by joining stop_times, trips, and routes.
  useEffect(() => {
    if (selectedFavorite) {
      const fetchBusSchedule = async () => {
        setScheduleLoading(true);
        try {
          const res = await axios.post('http://db.scholomance.io:2501/api/stop_times/query', {
            query: `SELECT st.stop_id, st.arrival_time, r.route_short_name 
                    FROM stop_times st
                    JOIN trips t ON st.trip_id = t.trip_id
                    JOIN routes r ON t.route_id = r.route_id
                    WHERE st.stop_id = '${selectedFavorite.stop_id}'`
          });
          setBusScheduleData(res.data);
        } catch (err) {
          console.error('Error fetching bus schedule:', err);
        } finally {
          setScheduleLoading(false);
        }
      };
      fetchBusSchedule();
    }
  }, [selectedFavorite]);

  if (loading) return <ActivityIndicator />;

  return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.header}>Favorite Stops</Text>
          <FlatList
              data={favorites}
              keyExtractor={(item) => item.stop_id.toString()}
              renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => setSelectedFavorite(item)}>
                    <Text style={styles.itemText}>{item.stop_name}</Text>
                  </TouchableOpacity>
              )}
          />
          <Text style={styles.backText}>Press home to return</Text>
          {selectedFavorite !== null && (
              <BusScheduele
                  stopName={selectedFavorite.stop_name}
                  onClose={() => {
                    setSelectedFavorite(null);
                    setBusScheduleData([]);
                  }}
              >
                {scheduleLoading ? (
                    <ActivityIndicator />
                ) : busScheduleData.length > 0 ? (
                    busScheduleData.map((entry, index) => (
                        <Text key={index}>
                          Route {entry.route_short_name} arrives at {entry.arrival_time}
                        </Text>
                    ))
                ) : (
                    <Text>No schedule available.</Text>
                )}
              </BusScheduele>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 45,
    textAlign: 'center',
  },
  itemText: {
    backgroundColor: '#c8daff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 20,
  },
  backText: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 18,
    color: '#666',
  },
});

export default FavoriteStops;
