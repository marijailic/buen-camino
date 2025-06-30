// src/layouts/ProtectedLayout.js

import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedLayout;
