import React from 'react';
import { Marker } from 'react-native-maps';

interface BusMarkerProps {
  stopID: string;
  stopName: string;
  latitude: number;
  longitude: number;
  onPress: (stopID: string) => void;
  pinColor?: string; 
}

const BusStopMarker: React.FC<BusMarkerProps> = ({
  stopID,
  stopName,
  latitude,
  longitude,
  onPress,
  pinColor = 'red', 
}) => {
  return (
    <Marker
      coordinate={{ latitude, longitude }}
      title={stopName}
      onPress={() => onPress(stopID)}
      pinColor={pinColor}
    />
  );
};

export default BusStopMarker;