import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

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

            <View style={styles.scrollWrapper}>
                <ScrollView 
                    style={styles.scrollContainer} 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 280,
        backgroundColor: "rgba(255, 255, 255, 0.95)", 
        borderLeftWidth: 2,
        borderLeftColor: "#d3d3d3",
        paddingHorizontal: 20,
        paddingVertical: 25,
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        elevation: 0,
        shadowColor: "transparent", 
        shadowOpacity: 0, 
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
    },
    header: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
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
        color: "#2DAEC5",
        fontWeight: "bold",
    },
    scrollWrapper: {
        flex: 1, 
        overflow: "hidden", 
    },
    scrollContainer: {
        flexGrow: 1, 
        paddingBottom: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
});

export default BusSchedule;
