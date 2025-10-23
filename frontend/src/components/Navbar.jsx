import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, UserPlus, LogIn } from 'lucide-react';
import AppContext from '../context/AppContext';
import { logout } from '../serviceWorkers/authServices';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const publicLinks = [
        { label: "Home", to: "/", icon: Home },
        { label: "Register", to: "/register", icon: UserPlus },
        { label: "Login", to: "/login", icon: LogIn },
    ];

    const authenticatedLinks = [
        { label: "Home", to: "/", icon: Home },
        { label: "Dashboard", to: "/dashboard", icon: User },
    ];

    const links = user ? authenticatedLinks : publicLinks;

    // Close drawer when route changes
    useEffect(() => {
        setIsDrawerOpen(false);
    }, [location.pathname]);

    // Navigate to home when user state changes (login/logout)
    useEffect(() => {
        // Only navigate if we're not already on home page
        if (location.pathname !== '/') {
            // Small delay to ensure state updates are complete
            const timer = setTimeout(() => {
                if (user) {
                    // User just logged in - navigate to home
                    navigate('/');
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            setUser(null);
            closeDrawer();
            // Navigate to home page after logout
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear user and navigate home
            setUser(null);
            navigate('/');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 z-50 w-full bg-white/30 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-1 flex items-center justify-start">
                            <Link to={'/'} className='text-2xl font-semibold text-gray-800'>
                                Case<span className='text-emerald-500'>Perl</span>
                            </Link>
                        </div>

                        {/* Desktop menu */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-1">
                            {links.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === link.to
                                            ? 'text-emerald-500'
                                            : 'text-gray-800 hover:text-gray-600 hover:bg-gray-100/50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* User menu for desktop */}
                            {user && (
                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                                            {user.uname?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-800">
                                                {user.uname}
                                            </span>
                                            <span className="text-xs text-gray-500 capitalize">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="p-2 rounded-md text-gray-800 hover:text-emerald-500 hover:bg-gray-100/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={isLoggingOut ? 'Logging out...' : 'Logout'}
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={toggleDrawer}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-600 hover:bg-gray-100/50 focus:outline-none transition-colors"
                                aria-label="Toggle menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={closeDrawer}
                    aria-hidden="true"
                />
            )}

            {/* Mobile drawer - slides from right */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Drawer header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <Link
                            to={'/'}
                            className='text-2xl font-semibold text-gray-800'
                            onClick={closeDrawer}
                        >
                            Case<span className='text-emerald-500'>Perl</span>
                        </Link>
                        <button
                            onClick={closeDrawer}
                            className="p-2 rounded-md text-gray-800 hover:bg-gray-100 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* User info in drawer */}
                    {user && (
                        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-lg">
                                    {user.uname?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-semibold text-gray-800">
                                        {user.uname}
                                    </span>
                                    <span className="text-sm text-gray-500 capitalize">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Drawer links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {links.map(link => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={closeDrawer}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${location.pathname === link.to
                                            ? 'text-emerald-500 bg-emerald-50'
                                            : 'text-gray-800 hover:text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout button in drawer */}
                    {user && (
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-base font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;