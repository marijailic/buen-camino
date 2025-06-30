// src/pages/Home.js

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import MapWrapper from "../components/map/MapWrapper";
import { getUsers, updateLocation } from "../api/usersApi";
import { useAuth } from "../context/auth/AuthContext";

const maxDistanceKm = process.env.REACT_APP_MAX_DISTANCE_KM;

const Home = () => {
    const [position, setPosition] = useState(null);
    const [users, setUsers] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const response = await getUsers(token);
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;
                setPosition([latitude, longitude]);

                updateLocation(token, { latitude, longitude }).finally(() => {
                    fetchUsersData();
                });

                setInterval(() => {
                    updateLocation(token, { latitude, longitude });
                }, 1000 * 60);
            },
            (err) => {
                console.error("Geolocation error:", err);
                fetchUsersData();
            }
        );
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
                <p className="text-black">Loading map...</p>
            )}
        </div>
    );
};

export default Home;
