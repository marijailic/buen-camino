// src/pages/Conversations.js

import { useEffect, useState } from "react";
import { getAllReceivers } from "../api/messagesApi";
import { getUser } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Conversations = () => {
    const { token } = useAuth();
    const [receivers, setReceivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceivers = async () => {
            try {
                const { data } = await getAllReceivers(token);
                const ids = data.receiver_ids || [];

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
    }, [token]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-lg font-medium">
                        Loading conversations...
                    </p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-red-500">{error}</p>
                </div>
            );
        }

        if (receivers.length === 0) {
            return (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-lg font-medium text-gray-600">
                        No conversations...
                    </p>
                </div>
            );
        }

        return (
            <div className="mt-6 w-full">
                <div
                    className="flex flex-col gap-2 overflow-y-auto pr-2 hide-scrollbar"
                    style={{ maxHeight: "calc(100vh - 128px)" }}
                >
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
        );
    };

    return (
        <div className="min-h-screen flex flex-col px-6 bg-gray-100">
            <h1 className="text-2xl font-bold mt-6 mb-1">CONVERSATIONS</h1>
            {renderContent()}
        </div>
    );
};

export default Conversations;
