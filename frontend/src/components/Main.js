// src/components/Main.js

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { haversine } from "../helpers/distanceHelper";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const redIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const yellowIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const Main = () => {
    const [position, setPosition] = useState(null);

    let positions = [];
    for (let i = 0; i < 50; i++) {
        positions.push([
            Math.random() + 45.1772416 - 0.5,
            Math.random() + 13.9722752 - 0.5,
        ]);
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                console.log(latitude, longitude);
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
                    <Marker position={position} icon={redIcon}>
                        <Popup>You are here</Popup>
                    </Marker>
                    {positions.map((pos) => {
                        const distance = haversine(
                            pos[0],
                            pos[1],
                            position[0],
                            position[1]
                        );
                        return (
                            <Marker
                                position={pos}
                                icon={distance < 30 ? yellowIcon : blueIcon}
                            >
                                <Popup>You are not here</Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            ) : (
                <p className="text-white">Loading map...</p>
            )}
        </div>
    );
};

export default Main;
