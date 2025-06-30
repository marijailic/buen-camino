// src/pages/Welcome.js

import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center mb-6">
                <img src="/icon.png" className="w-24 h-auto mb-4" alt="Logo" />
                <div className="text-2xl font-bold">BUEN CAMINO</div>
            </div>
            <div className="w-full max-w-md px-6 bg-white rounded text-black text-center">
                <Link
                    to="/login"
                    className="inline-block bg-black text-white px-4 py-2 mr-2 rounded"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="inline-block bg-black text-white px-4 py-2 rounded"
                >
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Welcome;
