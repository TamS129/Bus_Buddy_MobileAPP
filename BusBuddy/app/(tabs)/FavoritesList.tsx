import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

const FavoriteStops = ({ userID }: { userID: string }) => {
  const [stopIDs, setStopIDs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

    const uid = 4567

  useEffect(() => {
    const fetchFavorites = async () => {

      try {
        const res = await axios.post('http://db.scholomance.io:2501/api/favorites/query', {
          query: "SELECT stop_id FROM favorites WHERE userID = 4567"
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
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 45 }}>Favorite Stops</Text>
      <FlatList
        data={stopIDs}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => <Text>Stop ID: {item}</Text>}
      />
    </View>
  );
};

export default FavoriteStops;
