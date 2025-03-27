import React from 'react';
import { Marker } from 'react-native-maps';
import * as SecureStore from 'expo-secure-store';

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
    const handlePress = async () => {
        try {
            await SecureStore.setItemAsync('stop_id', stopID.toString());
            onPress(stopID);
        } catch (error) {
            console.error("Error updating stop ID in secure storage:", error);
        }
    };

    return (
        <Marker
            coordinate={{ latitude, longitude }}
            title={stopName}
            onPress={handlePress}
            pinColor={pinColor}
        />
    );
};

export default BusStopMarker;
