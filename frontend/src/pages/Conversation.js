// src/pages/Conversation.js

import { useEffect, useRef, useState } from "react";
import {
    getByReciever,
    sendMessage,
    editMessage,
    deleteMessage,
} from "../api/messagesApi";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

    const bottomRef = useRef(null);

    const fetchMessages = async () => {
        try {
            setError(null);
            const { data } = await getByReciever(token, userId);
            setMessages(data);
        } catch (err) {
            setError("Failed to load conversations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const fetchReceiver = async () => {
            try {
                const receiverRes = await getUser(token, userId);
                setReceiver(receiverRes.data.data);
            } catch {
                console.error("Failed to fetch recipient");
            }
        };
        fetchReceiver();
    }, [token, userId]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        await sendMessage(token, input.trim(), userId, authUserId);
        setInput("");
        await fetchMessages();
    };

    const startEdit = (id, currentText) => {
        setEditingId(id);
        setEditingText(currentText);
    };

    const saveEdit = async (messageId) => {
        await editMessage(token, editingText.trim(), messageId);
        setEditingId(null);
        setEditingText("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    const deleteMsg = async (messageId) => {
        await deleteMessage(token, messageId);
    };

    const newMessage = (data) => {
        setMessages((prev) => [...prev, data]);
    };

    const updateMessageHandler = (data) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === data.id ? { ...msg, text: data.text } : msg
            )
        );
    };

    const deleteMessageHandler = (data) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== data.id));
    };

    useEffect(() => {
        const users = [authUserId, userId].sort();
        const channelName = `chat.${users[0]}.${users[1]}`;

        const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
            cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
        });

        const channel = pusher.subscribe(channelName);
        channel.bind("new-message", newMessage);
        channel.bind("update-message", updateMessageHandler);
        channel.bind("delete-message", deleteMessageHandler);

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [authUserId, userId]);

    return (
        <div className="min-h-screen flex flex-col justify-between px-6 bg-gray-100 w-full">
            <div>
                {receiver && (
                    <div className="text-2xl font-bold mt-6 mb-1">
                        {receiver.first_name} {receiver.last_name}
                    </div>
                )}
                {!messages.length && (
                    <div className="text-lg font-medium">No messages...</div>
                )}
            </div>

            <div className="flex flex-col flex-grow overflow-y-auto space-y-3 mb-4 pr-2 hide-scrollbar max-h-[70vh]">
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
                                        value={editingText}
                                        onChange={(e) =>
                                            setEditingText(e.target.value)
                                        }
                                        className="w-[500px] text-base px-2 py-1 bg-white text-gray-900 focus:outline-none resize-none overflow-hidden"
                                        rows={3}
                                    />
                                    <div className="flex items-center justify-end space-x-2 mt-2">
                                        <button
                                            onClick={() => saveEdit(msg.id)}
                                            className="text-sm underline text-gray-900 hover:text-gray-500"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="text-sm underline text-gray-900 hover:text-gray-500"
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
                <div ref={bottomRef} />
            </div>

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
