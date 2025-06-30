// src/components/map/markers/UserMarkers.js

import { Marker, Popup } from "react-leaflet";
import { yellowIcon } from "../../../leaflet/markerIcons";

const UserMarkers = ({ users }) => {
    return (
        <>
            {users.map((user) => {
                return (
                    <Marker
                        key={user.id}
                        position={[user.latitude, user.longitude]}
                        icon={yellowIcon}
                    >
                        <Popup>{user.first_name + " " + user.last_name}</Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default UserMarkers;
