// src/pages/Profile.js

import { useEffect, useState } from "react";
import { getUser } from "../api/usersApi";
import {
    getPostsByUser
} from "../api/postsApi";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";

const Profile = () => {
    const { userId } = useParams();
    const { token } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const userRes = await getUser(token, userId);
                const postRes = await getPostsByUser(token, userId);
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
    }, [token, userId]);

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

            {/* Posts List */}
            <div className="flex flex-col gap-2 max-w-xl w-full max-h-[80vh] overflow-y-auto pr-2 hide-scrollbar">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white rounded shadow p-4 flex flex-col"
                    >
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
                            </>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
