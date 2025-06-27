// src/components/Main.js

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Main = () => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
            },
            (err) => {
                console.error("Geolocation error:", err);
            }
        );
    }, []);

    return (
        <div className="w-full h-full">
            {position ? (
                <MapContainer
                    center={position}
                    zoom={13}
                    className="w-full h-[100vh] rounded-lg"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>You are here</Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <p className="text-white">Loading map...</p>
            )}
        </div>
    );
};

export default Main;
