// src/components/Sidebar.js

const Sidebar = () => {
    return (
        <aside className="w-64 p-6 bg-white text-black h-full">
            <div className="mt-10">
                <div className="mt-10 flex flex-col items-center">
                    <img src="/icon.png" className="w-24 h-auto mb-6" />

                    <div className="mb-10 text-2xl font-bold">BUEN CAMINO</div>
                </div>
                <nav className="flex flex-col space-y-2">
                    <a href="/home" className="inline hover:underline">
                        Home
                    </a>
                    <a href="#" className="inline hover:underline">
                        My profile
                    </a>
                    <a href="/conversations" className="inline hover:underline">
                        Conversations
                    </a>
                    <a href="#" className="inline hover:underline">
                        Log Out
                    </a>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
