// src/pages/NotFound.js

import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center">
                <img src="/icon.png" className="w-24 h-auto mb-4" alt="Logo" />
                <div className="text-2xl font-bold">BUEN CAMINO</div>
                <h2 className="text-l font-bold mb-6 text-center">
                    Page Not Found
                </h2>
            </div>
            <div className="w-full max-w-md px-6 bg-white rounded text-black text-center">
                <p className="text-black-800 mb-6">
                    Sorry, the page you are looking for does not exist.
                </p>
                <Link
                    to="/home"
                    className="inline-block bg-black text-white px-4 py-2 rounded"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
