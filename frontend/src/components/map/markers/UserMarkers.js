// src/components/map/markers/UserMarkers.js

import { Marker, Popup } from "react-leaflet";
import { yellowIcon } from "../../../leaflet/markerIcons";
import { Link } from "react-router-dom";

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
                        <Popup>
                            <Link
                                to={`/conversation/${user.id}`}
                                style={{ color: "black" }}
                                className="no-underline hover:underline"
                            >
                                {user.first_name} {user.last_name}
                            </Link>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default UserMarkers;
