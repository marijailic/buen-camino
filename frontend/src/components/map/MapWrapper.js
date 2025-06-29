import { MapContainer, TileLayer } from "react-leaflet";
import CurrentUserMarker from "./markers/CurrentUserMarker";
import UserMarkers from "./markers/UserMarkers";

const MapWrapper = ({ position, users, maxRange }) => (
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
        <UserMarkers users={users} position={position} maxRange={maxRange} />
    </MapContainer>
);

export default MapWrapper;
