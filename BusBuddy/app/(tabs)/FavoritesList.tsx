import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import axios from 'axios';


const FavoriteStops = ({ userID }: { userID: string }) => {
  const [stopIDs, setStopIDs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);


    const uid = 4567
    console.log(uid.toString());

  useEffect(() => {
    const fetchFavorites = async () => {

      try {
        const res = await axios.post('http://db.scholomance.io:2501/api/favorites/query', {
          query: "SELECT stop_id FROM favorites WHERE userID = " + uid.toString()
        });

        const ids = res.data.map((fav: any) => fav.stop_id);
        setStopIDs(ids);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userID]);

  if (loading) return <ActivityIndicator />;

  return (
    <SafeAreaProvider>
      <SafeAreaView>
      <Text style={{ fontSize: 25, fontWeight: 'bold', margin: 45 }}>Favorite Stops</Text>
      <FlatList
        data={stopIDs}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => <Text style={styles.container}>Stop ID: {item}</Text>}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 32,
  },
});

export default FavoriteStops;
