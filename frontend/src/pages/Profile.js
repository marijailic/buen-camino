// src/pages/Profile.js

import { useEffect, useState } from "react";
import { getUser } from "../api/usersApi";
import { getPostsByUser } from "../api/postsApi";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useProfileData = (token, userId) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userRes, postRes] = await Promise.all([
                    getUser(token, userId),
                    getPostsByUser(token, userId),
                ]);

                setUser(userRes.data?.data || userRes.data);
                setPosts(postRes.data?.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, userId]);

    return { user, posts, loading, error };
};

const Profile = () => {
    const { token } = useAuth();
    const { userId } = useParams();
    const { user, posts, loading, error } = useProfileData(token, userId);

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
        <div className="min-h-screen flex flex-col px-6 bg-gray-100">
            {user && (
                <header className="mt-6 mb-1 flex items-center justify-between text-2xl font-bold">
                    <span>
                        {user.first_name} {user.last_name}
                    </span>
                    <Link
                        to={`/conversation/${user.id}`}
                        className="bg-black text-white px-4 py-2 rounded text-base font-normal"
                    >
                        Start conversation
                    </Link>
                </header>
            )}

            <section
                className="mt-6 flex flex-col gap-2 overflow-y-auto pr-2 hide-scrollbar"
                style={{ maxHeight: "calc(100vh - 128px)" }}
            >
                {posts.length === 0 ? (
                    <div className="flex items-center justify-center h-[calc(100vh-128px)]">
                        <p className="text-lg font-medium text-gray-600">
                            No posts...
                        </p>
                    </div>
                ) : (
                    posts.map(({ id, text, image_url }) => (
                        <article
                            key={id}
                            className="bg-white rounded shadow p-4 flex flex-col"
                        >
                            <p className="text-base whitespace-pre-wrap">
                                {text}
                            </p>
                            {image_url && (
                                <img
                                    src={image_url}
                                    alt="Post"
                                    className="mt-2 rounded max-h-64 object-cover"
                                />
                            )}
                        </article>
                    ))
                )}
            </section>
        </div>
    );
};

export default Profile;
