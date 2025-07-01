// src/pages/Conversations.js

import { useEffect, useState } from "react";
import { getAllReceivers } from "../api/messagesApi";
import { getUser } from "../api/usersApi";
import { useAuth } from "../context/auth/AuthContext";
import { Link } from "react-router-dom";

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
        <div className="min-h-screen flex flex-col px-6 bg-gray-100">
            <div className="text-2xl font-bold mt-6 mb-1">CONVERSATIONS</div>

            {receivers.length === 0 ? (
                <div className="flex flex-col items-start justify-start">
                    <div className="text-lg font-medium">
                        No conversations...
                    </div>
                </div>
            ) : (
                <div className="mt-6 w-full">
                    <div className="flex flex-col gap-2 max-h-[80vh] overflow-y-auto pr-2 hide-scrollbar">
                        {receivers.map((user) => (
                            <Link
                                key={user.data.id}
                                to={`/conversation/${user.data.id}`}
                                className="bg-white rounded shadow p-4 flex items-center no-underline hover:bg-gray-50 w-full"
                            >
                                <img
                                    src="/icon.png"
                                    alt="User"
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="text-lg font-semibold">
                                    {user.data.first_name} {user.data.last_name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Conversations;
