const Header = () => {
    return (
        <header className = "bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2x1 font-bold">Task Tracker</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li>Home</li>
                    <li>Dashboard</li>
                </ul>
            </nav>
            </div>
            </header>
    );  
};
export default Header;