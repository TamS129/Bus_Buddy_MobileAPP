import React from 'react';
import { Marker } from 'react-native-maps';

interface BusMarkerProps {
    stopID: number; 
    stopName: string;
    latitude: number;
    longitude: number;
    onPress: (stopID: number) => void; 
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