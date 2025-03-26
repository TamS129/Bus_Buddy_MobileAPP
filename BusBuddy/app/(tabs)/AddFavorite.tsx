import axios from "axios";
import { useEffect } from 'react';

const uid = 4567; // Get from device info -- device info package broken apparently
const sid = 101010;

const AddFavorite = ({
  userID,
  stopID,
}: {
  userID: string;
  stopID: number;
}) => {
useEffect(() => {
    const addFavorite = async () => {
      try {
        await axios.post('http://db.scholomance.io:2501/api/favorites', {
          userID: uid,
          stop_id: sid,
        });
      } catch (err) {
       console.error('Failed to add favorite:', err);
      }
   };

    addFavorite();
  }, [userID, stopID]);

  return null;
};

export default AddFavorite;
