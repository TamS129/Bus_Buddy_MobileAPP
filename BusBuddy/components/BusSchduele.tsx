/*
Component that contains the template and CSS for Our bus schduele
*/
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface BusScheduleProps {
    stopName: string;
    onClose: () => void;
    children?: React.ReactNode;
}

const BusSchedule: React.FC<BusScheduleProps> = ({ stopName, onClose, children }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onClose}
                accessibilityLabel="Close Schedule"
            >
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Schedule for {stopName}</Text>
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 280,
        backgroundColor: "#fff",
        borderLeftWidth: 2,
        borderLeftColor: "#d3d3d3",
        paddingHorizontal: 20,
        paddingVertical: 25,
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: -2, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    header: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 20,  
        marginBottom: 20, 
        color: "#333",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
    },
    closeText: {
        fontSize: 18,
        color: "#ff4d4d",
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        paddingTop: 20, 
    },
});

export default BusSchedule;
