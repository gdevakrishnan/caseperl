import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const links = [
        { "label": "Home", "to": "/" },
        { "label": "Register", "to": "/register" },
        { "label": "Login", "to": "/login" },
    ];

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
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
                                Case<span className='text-primary text-emerald-500'>Perl</span>
                            </Link>
                        </div>

                        {/* Desktop menu */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-1">
                            {links.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                        location.pathname === link.to
                                            ? 'text-emerald-500'
                                            : 'text-gray-800 hover:text-gray-600 hover:bg-gray-100/50'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
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
                className={`fixed top-0 right-0 h-full w-80 bg-white backdrop-blur-md shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
                    isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
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
                            Case<span className='text-primary text-emerald-500'>Perl</span>
                        </Link>
                        <button
                            onClick={closeDrawer}
                            className="p-2 rounded-md text-gray-800 hover:bg-gray-100 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Drawer links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={closeDrawer}
                                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                                    location.pathname === link.to
                                        ? 'text-primary bg-primary/10'
                                        : 'text-gray-800 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;