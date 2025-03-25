import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface BusSchdueleProps {
    stopName: string;
    onClose: () => void;
    children?: React.ReactNode;
}

const BusSchduele: React.FC<BusSchdueleProps> = ({ stopName, onClose, children }) => {
    return (
        <View style={styles.modalContainer}>
            <View style={styles.scheduleContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    
                    <Text style={styles.closeText}>Exit</Text>
                    
                </TouchableOpacity>

                <Text style={styles.schHeader}>Schedule for {stopName}</Text>
                {children && (
                    <View>
                        {React.Children.map(children, (child, index) => {

                            if (React.isValidElement(child) && child.type === Text) {
                                const textContent = child.props.children as string;
                                const [arrivalTime, departureTime] = textContent.split(", ");
                                return (
                                    <View key={index} style={styles.timeContainer}>

                                        <Text style={styles.timeLabel}>Arrival:</Text>
                                        <Text style={styles.timeValue}>{arrivalTime.replace("Arrival: ", "")}</Text>

                                        <Text style={styles.timeLabel}>Departure:</Text>
                                        <Text style={styles.timeValue}>{departureTime.replace("Departure: ", "")}</Text>
                                    </View>
                                );
                            }
                            return child;
                        })}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    scheduleContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    schHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 10,
        marginBottom: 10,
    },
    closeText: {
        fontSize: 16,
        color: "red",
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    timeLabel: {
        fontWeight: "bold",
        marginRight: 5,
    },
    timeValue: {
        flex: 1,
    },
});

export default BusSchduele;