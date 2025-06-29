import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import MapWrapper from "./map/MapWrapper";

const Main = () => {
    const [position, setPosition] = useState(null);
    const [users, setUsers] = useState([]);
    const [token, setToken] = useState(null);
    const maxRange = 30;
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`${backendUrl}/sanctum/csrf-cookie`);
            const loginResponse = await axios.post(`${backendUrl}/api/login`, {
                email: "example@example.com",
                password: "password",
            });
            setToken(`Bearer ${loginResponse.data.access_token}`);
        };
        fetchData();
    }, [backendUrl]);

    useEffect(() => {
        if (!token) return;

        const fetchUsers = async () => {
            const response = await axios.get(`${backendUrl}/api/users`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            });
            console.log(response);
            setUsers(response.data);
        };

        fetchUsers();

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const [latitude, longitude] = [45.1772416, 13.9722752];
                setPosition([latitude, longitude]);

                setInterval(async () => {
                    await axios.post(
                        `${backendUrl}/api/users/update-location`,
                        { latitude, longitude },
                        {
                            headers: {
                                Authorization: token,
                                Accept: "application/json",
                            },
                        }
                    );
                }, 1000 * 60);
            },
            (err) => {
                console.error("Geolocation error:", err);
            }
        );
    }, [token, backendUrl]);

    return (
        <div className="w-full h-full">
            {position ? (
                <MapWrapper
                    position={position}
                    users={users}
                    maxRange={maxRange}
                />
            ) : (
                <p className="text-white">Loading map...</p>
            )}
        </div>
    );
};

export default Main;
