// src/components/Sidebar.js

import { logout } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { token, authLogout, firstName, lastName } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(token);
            authLogout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside className="w-64 p-6 bg-white text-black h-full">
            <div className="mt-10">
                <div className="mt-10 flex flex-col items-center">
                    <img src="/icon.png" className="w-24 h-auto mb-6" />

                    <div className="mb-1 text-2xl font-bold">BUEN CAMINO</div>
                    <h2 className="mb-8 text-center">
                        {firstName} {lastName}
                    </h2>
                </div>
                <nav className="flex flex-col space-y-2">
                    <a href="/home" className="inline hover:underline">
                        Home
                    </a>
                    <a href="/my-profile" className="inline hover:underline">
                        My profile
                    </a>
                    <a href="/conversations" className="inline hover:underline">
                        Conversations
                    </a>
                    <button
                        onClick={handleLogout}
                        className="text-left inline hover:underline"
                    >
                        Log Out
                    </button>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
