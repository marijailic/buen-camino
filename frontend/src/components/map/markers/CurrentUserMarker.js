// src/components/map/markers/CurrentUserMarker.js

import { Marker, Popup } from "react-leaflet";
import { redIcon } from "../../../leaflet/markerIcons";

const CurrentUserMarker = ({ position }) => (
    <Marker position={position} icon={redIcon}>
        <Popup>You are here</Popup>
    </Marker>
);

export default CurrentUserMarker;
