// src/pages/MyProfile.js

import { useEffect, useState } from "react";
import { getUser } from "../api/usersApi";
import {
    getPostsByUser,
    createPost,
    deletePost,
    updatePost,
} from "../api/postsApi";
import { useAuth } from "../context/AuthContext";

const MyProfile = () => {
    const { token, authUserId } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState("");

    const [newPostText, setNewPostText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        const fetchProfileAndPosts = async () => {
            try {
                setLoading(true);
                const [userRes, postsRes] = await Promise.all([
                    getUser(token, authUserId),
                    getPostsByUser(token, authUserId),
                ]);
                setUser(userRes.data);
                setPosts(postsRes.data.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndPosts();
    }, [token, authUserId]);

    const refreshPosts = async () => {
        try {
            const res = await getPostsByUser(token, authUserId);
            setPosts(res.data.data);
        } catch (err) {
            console.error("Failed to refresh posts:", err);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostText.trim() && !imageFile) {
            setFormError("Please write something or select an image.");
            return;
        }

        if (!newPostText.trim() && imageFile) {
            setFormError("Please write something, cannot upload picture only.");
            return;
        }

        setFormError("");

        try {
            await createPost(token, {
                text: newPostText,
                image: imageFile,
                userId: authUserId,
            });
            setNewPostText("");
            setImageFile(null);
            refreshPosts();
        } catch (err) {
            console.error("Post creation failed:", err);
            setFormError("Failed to create post. Please try again.");
        }
    };

    const handleEditPost = async (id) => {
        try {
            await updatePost(token, id, { text: editingText });
            setEditingId(null);
            refreshPosts();
        } catch (err) {
            console.error("Post update failed:", err);
        }
    };

    const handleDeletePost = async (id) => {
        try {
            await deletePost(token, id);
            refreshPosts();
        } catch (err) {
            console.error("Post deletion failed:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-medium">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>

            <div className="bg-white p-4 rounded shadow mb-6">
                <textarea
                    placeholder="What's on your mind?"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-2 resize-none"
                    rows={3}
                />
                {formError && (
                    <p className="text-red-500 text-sm mb-2">{formError}</p>
                )}
                <div className="flex items-center justify-between">
                    <label className="bg-black text-white py-2 px-4 rounded cursor-pointer">
                        Upload an image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImageFile(file);
                                if (file) {
                                    setImagePreview(URL.createObjectURL(file));
                                } else {
                                    setImagePreview(null);
                                }
                            }}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={handleCreatePost}
                        className="bg-black text-white py-2 px-4 rounded"
                    >
                        Post
                    </button>
                </div>
                {imageFile && (
                    // <div className="mt-2 flex items-center gap-4">
                    //     <img
                    //         src={imagePreview}
                    //         alt="Selected"
                    //         className="w-20 h-20 object-cover rounded border"
                    //     />
                    <p className="text-sm text-gray-600">{imageFile.name}</p>
                    // </div>
                )}
            </div>

            <div
                className="flex flex-col gap-3 overflow-y-auto hide-scrollbar pr-2"
                style={{ maxHeight: "calc(100vh - 350px)" }}
            >
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
                                <div className="flex gap-4 text-sm underline cursor-pointer opacity-80 hover:opacity-100">
                                    <span
                                        onClick={() => handleEditPost(post.id)}
                                    >
                                        Save
                                    </span>
                                    <span onClick={() => setEditingId(null)}>
                                        Cancel
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-base whitespace-pre-wrap">
                                    {post.text}
                                </p>
                                {post.image_url && (
                                    <img
                                        src={post.image_url}
                                        alt="Post"
                                        className="mt-2 rounded max-h-64 object-cover"
                                    />
                                )}
                                <div className="flex gap-4 mt-2 text-xs underline cursor-pointer opacity-80 hover:opacity-100">
                                    <span
                                        onClick={() => {
                                            setEditingId(post.id);
                                            setEditingText(post.text);
                                        }}
                                    >
                                        Edit
                                    </span>
                                    <span
                                        onClick={() =>
                                            handleDeletePost(post.id)
                                        }
                                    >
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
