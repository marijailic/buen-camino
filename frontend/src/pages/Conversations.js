// src/pages/Conversations.js

import { useEffect, useState } from "react";
import { getAllReceivers } from "../api/messagesApi";
import { getUser } from "../api/usersApi";
import { useAuth } from "../context/auth/AuthContext";

const Conversations = () => {
    const { token } = useAuth();
    const [receivers, setReceivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceivers = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data } = await getAllReceivers(token);
                const ids = data.receiver_ids;

                const userPromises = ids.map((id) =>
                    getUser(token, id).then((res) => res.data)
                );
                const users = await Promise.all(userPromises);

                setReceivers(users);
            } catch (err) {
                console.error(err);
                setError("Failed to load conversations.");
            } finally {
                setLoading(false);
            }
        };

        fetchReceivers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-lg font-medium">
                    Loading conversations...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-100">
            <div className="text-2xl font-bold mb-6">Conversations</div>
            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                {receivers.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white rounded shadow p-4 flex flex-col items-center"
                    >
                        <img
                            src="/icon.png"
                            alt="User"
                            className="w-16 h-16 mb-2"
                        />
                        <div className="text-lg font-semibold">
                            {user.first_name} {user.last_name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Conversations;
