// src/pages/MyProfile.js

import { useEffect, useState } from "react";
import { getUser } from "../api/usersApi";
import {
    getPostsByUser,
    createPost,
    deletePost,
    updatePost,
} from "../api/postsApi";
import { useAuth } from "../context/auth/AuthContext";

const MyProfile = () => {
    const { token, authUserId } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newPostText, setNewPostText] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const userRes = await getUser(token, authUserId);
                const postRes = await getPostsByUser(token, authUserId);
                setUser(userRes.data);
                setPosts(postRes.data.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, authUserId]);

    const handlePostSubmit = async () => {
        try {
            await createPost(token, { text: newPostText, image: imageFile, userId: authUserId });
            setNewPostText("");
            setImageFile(null);
            const updatedPosts = await getPostsByUser(token, authUserId);
            setPosts(updatedPosts.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (id, text) => {
        setEditingId(id);
        setEditingText(text);
    };

    const handleUpdate = async (id) => {
        await updatePost(token, id, { text: editingText });
        setEditingId(null);
        const updatedPosts = await getPostsByUser(token, authUserId);
        setPosts(updatedPosts.data.data);
    };

    const handleDelete = async (id) => {
        await deletePost(token, id);
        const updatedPosts = await getPostsByUser(token, authUserId);
        setPosts(updatedPosts.data.data);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-lg font-medium">Loading profile...</div>
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
            <div className="text-2xl font-bold mt-6 mb-4">
                {user.first_name} {user.last_name}
            </div>

            {/* New Post Input */}
            <div className="bg-white p-4 rounded shadow max-w-xl w-full mb-6">
                <textarea
                    placeholder="What's on your mind?"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-2 resize-none"
                    rows={3}
                />
                <div className="flex items-center justify-between">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="text-sm"
                    />
                    <button
                        onClick={handlePostSubmit}
                        className="bg-black text-white py-2 px-4 rounded"
                    >
                        Post
                    </button>
                </div>
            </div>

            {/* Posts List */}
            <div className="flex flex-col gap-2 max-w-xl w-full max-h-[80vh] overflow-y-auto pr-2 hide-scrollbar">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white rounded shadow p-4 flex flex-col"
                    >
                        {editingId === post.id ? (
                            <>
                                <textarea
                                    value={editingText}
                                    onChange={(e) =>
                                        setEditingText(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 mb-2 resize-none"
                                    rows={3}
                                />
                                <div className="flex space-x-4 text-sm underline cursor-pointer opacity-80 hover:opacity-100">
                                    <span onClick={() => handleUpdate(post.id)}>
                                        Save
                                    </span>
                                    <span onClick={() => setEditingId(null)}>
                                        Cancel
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-base whitespace-pre-wrap">
                                    {post.text}
                                </div>
                                {post.image_url && (
                                    <img
                                        src={post.image_url}
                                        alt="Post"
                                        className="mt-2 rounded max-h-64 object-cover"
                                    />
                                )}
                                <div className="flex space-x-4 mt-1 text-xs underline cursor-pointer opacity-80 hover:opacity-100">
                                    <span
                                        onClick={() =>
                                            startEdit(post.id, post.text)
                                        }
                                    >
                                        Edit
                                    </span>
                                    <span onClick={() => handleDelete(post.id)}>
                                        Delete
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProfile;
