import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useFocusEffect } from "@react-navigation/native";

const AddFavorite = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);

            const getUUID = async () => {
                const storedUUID = await SecureStore.getItemAsync("secure_deviceid");
                if (storedUUID) {
                    console.log("Existing UUID: " + storedUUID);
                    return storedUUID;
                } else {
                    const newUUID = uuidv4();
                    await SecureStore.setItemAsync("secure_deviceid", newUUID);
                    console.log("New UUID: " + newUUID);
                    return newUUID;
                }
            };

            const getStopID = async () => {
                const storedStopId = await SecureStore.getItemAsync("stop_id");
                if (storedStopId) {
                    console.log("Found Stop ID: " + storedStopId);
                    return storedStopId;
                } else {
                    console.error("No stop id found in secure storage.");
                    return null;
                }
            };

            const addFavorite = async () => {
                try {
                    const uuid = await getUUID();
                    const stop_id = await getStopID();
                    if (!stop_id) {
                        setMessage("Stop ID is required to add a favorite.");
                        return;
                    }
                    // Check if the favorite already exists
                    const checkResponse = await axios.post(
                        "http://db.scholomance.io:2501/api/favorites/query",
                        {
                            query: `SELECT * FROM favorites WHERE userID = '${uuid}' AND stop_id = '${stop_id}'`,
                        }
                    );
                    if (checkResponse.data && checkResponse.data.length > 0) {
                        setMessage("Favorite already exists.");
                        return;
                    }
                    // If not, add the favorite
                    await axios.post("http://db.scholomance.io:2501/api/favorites", {
                        userID: uuid,
                        stop_id: stop_id,
                    });
                    setMessage("Favorite added.");
                } catch (err) {
                    console.error("Failed to add favorite:", err);
                    setMessage("Error adding favorite.");
                } finally {
                    setLoading(false);
                }
            };

            //SecureStore.deleteItemAsync('secure_deviceid'); // To delete the UUID if needed.
            addFavorite();
            return () => {};
        }, [])
    );

    if (loading) return <ActivityIndicator />;

    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.backText}>Press home to return</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: StatusBar.currentHeight || 0,
        alignItems: "center",
        justifyContent: "center",
    },
    message: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 20,
    },
    backText: {
        fontSize: 18,
        color: "#666",
    },
});

export default AddFavorite;
