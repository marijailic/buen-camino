// src/pages/Conversation.js

import { useEffect, useState } from "react";
import { getByReciever, sendMessage } from "../api/messagesApi";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import Pusher from "pusher-js";
import { getUser } from "../api/usersApi";

const Conversation = () => {
    const { userId } = useParams();
    const { token, authUserId } = useAuth();
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);

    const [input, setInput] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data } = await getByReciever(token, userId);

                setMessages(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load conversations.");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    useEffect(() => {
        const fetchReceiver = async () => {
            try {
                const receiver = await getUser(token, userId);
                setReceiver(receiver.data.data);
            } catch (err) {
                console.error("Failed to fetch recipient", err);
            }
        };
        fetchReceiver();
    }, [token, userId]);

    // Send new message (sender is "me")
    const handleSend = async () => {
        if (!input.trim()) return;

        // send to backend
        await sendMessage(token, input.trim(), userId, authUserId);

        setMessages((prev) => [
            ...prev,
            { id: Date.now(), sender: "me", text: input.trim() },
        ]);
        setInput("");
    };

    // Start editing a message (only for sender "me")
    const startEdit = (id, currentText) => {
        setEditingId(id);
        setEditingText(currentText);
    };

    // Save edited message
    const saveEdit = () => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === editingId ? { ...msg, text: editingText } : msg
            )
        );
        setEditingId(null);
        setEditingText("");
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    // Delete message
    const deleteMsg = (id) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    const newMessage = (data) => {
        console.log(data);
    };

    const users = [authUserId, userId].sort();
    let channelName = "chat." + users[0] + "." + users[1];

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
        cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    })
        .subscribe(channelName)
        .bind("new-message", newMessage);

    useEffect(() => {
        return () => {
            if (typeof pusher.data?.disconnect === "function") {
                pusher.data.disconnect();
            }
        };
    }, [pusher.data?.disconnect]);

    return (
        <div className="min-h-screen flex flex-col justify-between px-6 bg-gray-100 w-full">
            {receiver && (
                <div className="text-2xl font-bold mt-6 mb-1">
                    {receiver.first_name} {receiver.last_name}
                </div>
            )}
            {/* Messages container */}
            <div className="flex flex-col flex-grow overflow-y-auto space-y-3 mb-4 pr-2 hide-scrollbar max-h-[70vh] ">
                {messages.map((msg) => {
                    const isSender = msg.sender_id !== authUserId;
                    return (
                        <div
                            key={msg.id}
                            className={`max-w-[70%] p-3 rounded break-words ${
                                isSender
                                    ? "bg-white text-gray-900 self-end rounded-br-none"
                                    : "bg-white text-gray-900 self-start rounded-bl-none"
                            }`}
                        >
                            {editingId === msg.id && isSender ? (
                                <>
                                    <textarea
                                        className="w-full p-1 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        rows={2}
                                        value={editingText}
                                        onChange={(e) =>
                                            setEditingText(e.target.value)
                                        }
                                    />
                                    <div className="flex space-x-2 mt-1 justify-end">
                                        <button
                                            className="underline text-sm text-gray-900 hover:text-gray-500"
                                            onClick={saveEdit}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="underline text-sm text-gray-900 hover:text-gray-500"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>{msg.text}</div>
                                    {isSender && (
                                        <div className="flex space-x-4 mt-1 text-xs underline cursor-pointer opacity-80 hover:opacity-100">
                                            <span
                                                onClick={() =>
                                                    startEdit(msg.id, msg.text)
                                                }
                                            >
                                                Edit
                                            </span>
                                            <span
                                                onClick={() =>
                                                    deleteMsg(msg.id)
                                                }
                                            >
                                                Delete
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input area */}
            <div className="flex space-x-2 py-4">
                <input
                    type="text"
                    className="flex-grow border border-gray-300 rounded px-3 py-2 text-black"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 border border-gray-300 rounded bg-black text-white hover:bg-gray-900"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Conversation;
