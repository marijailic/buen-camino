// src/components/map/MapWrapper.js

import { MapContainer, TileLayer } from "react-leaflet";
import CurrentUserMarker from "./markers/CurrentUserMarker";
import UserMarkers from "./markers/UserMarkers";

const MapWrapper = ({ position, users }) => (
    <MapContainer
        center={position}
        zoom={9}
        className="w-full h-[100vh] rounded-lg"
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CurrentUserMarker position={position} />
        <UserMarkers users={users} />
    </MapContainer>
);

export default MapWrapper;
