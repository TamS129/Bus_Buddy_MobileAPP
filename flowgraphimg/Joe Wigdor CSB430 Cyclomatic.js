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
