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
                    <a href="#" className="inline hover:underline">
                        Moj profil
                    </a>
                    <a href="#" className="inline hover:underline">
                        Razgovori
                    </a>
                    <a href="#" className="inline hover:underline">
                        Odjava
                    </a>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
