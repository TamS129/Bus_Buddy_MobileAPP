import axios from "axios";

const uid = 4567;
const sid = 1001010

export default async function AddFavorite() {
    try {
        const res = await axios.post('http://db.scholomance.io:2501/api/busbuddy',
            {
            "userID": uid.toString(),
            "stop_id": sid.toString()
            }
        );

    } catch (err) {
        console.error('Error storing favorite:', err);
    }
}

