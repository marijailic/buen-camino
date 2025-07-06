// src/pages/Home.js

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import MapWrapper from "../components/map/MapWrapper";
import { getUsers, updateLocation } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";

const maxDistanceKm = process.env.REACT_APP_MAX_DISTANCE_KM;

const Home = () => {
    const [position, setPosition] = useState(null);
    const [users, setUsers] = useState([]);
    const { token } = useAuth();

    const fetchUsersData = async () => {
        try {
            const response = await getUsers(token);
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    };

    useEffect(() => {
        let locationInterval;

        const fetchAndWatchLocation = () => {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const latitude = pos.coords.latitude;
                    const longitude = pos.coords.longitude;
                    setPosition([latitude, longitude]);

                    try {
                        await updateLocation(token, { latitude, longitude });
                    } catch (err) {
                        console.error("Failed to update location:", err);
                    }

                    fetchUsersData();

                    locationInterval = setInterval(() => {
                        updateLocation(token, { latitude, longitude }).catch(
                            (err) =>
                                console.error(
                                    "Background location update failed:",
                                    err
                                )
                        );
                    }, 1000 * 60);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    fetchUsersData();
                }
            );
        };

        fetchAndWatchLocation();

        return () => {
            if (locationInterval) clearInterval(locationInterval);
        };
    }, [token]);

    return (
        <div className="w-full h-full">
            {position ? (
                <MapWrapper
                    position={position}
                    users={users}
                    maxRange={maxDistanceKm}
                />
            ) : (
                <div className="flex items-center justify-center min-h-screen text-lg">
                    Loading map...
                </div>
            )}
        </div>
    );
};

export default Home;
