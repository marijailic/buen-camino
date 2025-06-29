import { Marker, Popup } from "react-leaflet";
import { blueIcon, yellowIcon } from "../../../leaflet/markerIcons";
import { haversine } from "../../../utils/distanceHelper";

const UserMarkers = ({ users, position, maxRange }) => {
    return (
        <>
            {users.map((user) => {
                const distance = haversine(
                    user.latitude,
                    user.longitude,
                    position[0],
                    position[1]
                );

                return (
                    <Marker
                        key={user.id}
                        position={[user.latitude, user.longitude]}
                        icon={distance < maxRange ? yellowIcon : blueIcon}
                    >
                        <Popup>{user.first_name + " " + user.last_name}</Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default UserMarkers;
