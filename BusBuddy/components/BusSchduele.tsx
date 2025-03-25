import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BusSchdueleProps {
  stopName: string;
  onClose: () => void;
  children?: React.ReactNode; // Add children prop
}

const BusSchduele: React.FC<BusSchdueleProps> = ({ stopName, onClose, children }) => {
  return (
    <View style={styles.scheduleContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text>Exit</Text>
      </TouchableOpacity>
      <Text style={styles.schHeader}> Schduele for {stopName} </Text>
      {children} {/* Render children */}
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleContainer: {
    width: 200,
    backgroundColor: 'white',
    borderLeftWidth: 2,
    borderLeftColor: 'lightgray',
    padding: 15,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  schHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
    marginBottom: 5,
  },
});

export default BusSchduele;