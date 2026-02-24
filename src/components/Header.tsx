import { useState, useEffect } from 'react';
import { FaBuilding } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { logout } from '../features/login/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X, MessageSquare, LogOut, Search } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const token = localStorage.getItem('Token');
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const isAdmin = user.role === 'admin';
    const isLandlord = user.role === 'doctor';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(!!token);
    }, [token, user]);

    const handleLogout = () => {
        localStorage.removeItem('Token');
        localStorage.removeItem('User');
        dispatch(logout());
        setIsLoggedIn(false);
        setIsMenuOpen(false);
        navigate('/login');
    };

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        `${
            isActive ? "text-purple-600 underline" : "text-gray-700 hover: text-purple-600"
        } text-base lg:text-lg font-semibold transition-colors`;

        return (
            <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200" data-testid="header">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className='flex items-center justify-between h-16'>
                        <NavLink to="/" className="flex items-center gap-2" data-testid="logo">
                        <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify center'>
                            <FaBuilding className="w-8 h-8 text-white" />
                            </div>
                            <span className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>UniStay</span>
                            </NavLink>
                            <nav className="hidden md:flex space-x-8">
                                <NavLink to="/" className={getLinkClass} data-testid="desktop-home">Home</NavLink>
                                <NavLink to="/search" className={getLinkClass} data-testid="desktop-search">
                                <Search className="w-6 h-6" />Search</NavLink>
                                {isLoggedIn && (
                                    <NavLink to="/dashboard" className={getLinkClass} data-testid="desktop-dashboard">Dashboard</NavLink>
                                )}
                                {isLandlord && (
                                    <NavLink to="/landlord" className={getLinkClass} data-testid="desktop-landlord">Landlord</NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink to="/admin" className={getLinkClass} data-testid="desktop-admin">Admin</NavLink>
                                )}
                            </nav>

                            {/* Desktop CTA Buttons */}
                            <div className="hidden md:flex items-center space-x-4">
                                {isLoggedIn ? (
                                <>
                                    <NavLink to="/messages" data-testid="desktop-messages" className="px-4 py-2 border rounded-md text-gray-700 hover:border-purple-600 transition-colors">
                                    <div className='relative p-2 hover:bg-slate-100 rounded-lg'>
                                        <MessageSquare className="w-6 h-6 text-slate-600" /></div></NavLink>
                                        <NavLink
                                        to="/settings"
                                        data-testid="desktop-settings"
                                        className="px-4 py-2 border rounded-md text-gray-700 hover:border-purple-600 transition-colors"
                                    >
                                        <div className='relative p-2 hover:bg-slate-100 rounded-lg'>
                                        <IoSettingsOutline className="w-6 h-6 text-slate-600" /></div>
                                    </NavLink>
                                    <NavLink
                                        to="/profile"
                                        data-testid="desktop-profile"
                                        className="px-4 py-2 border rounded-md text-gray-700 hover:border-purple-600 transition-colors"
                                    >
                                        Profile
                                    </NavLink>
                                    <button onClick={handleLogout} data-testid="desktop-logout" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                    <LogOut className="w-6 h-6" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/login"
                                        data-testid="desktop-login"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        data-testid="desktop-register"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                    >
                                        Register
                                    </NavLink>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} data-testid="mobile-menu-button" className='text-gray-700 hover:text-purple-600 transition-colors duration-200'>
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className='md:hidden'>
                            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t'>
                                <NavLink to='/' data-testid="mobile-home" className={`${getLinkClass} text-black`} onClick={() => setIsMenuOpen(false)}>
                                    Home
                                </NavLink>
                                <NavLink to='/search' data-testid="mobile-search" className={`${getLinkClass} text-black`} onClick={() => setIsMenuOpen(false)}>
                                <Search className="w-6 h-6" />
                                    Search
                                </NavLink>
                                {isLoggedIn && (
                                    <NavLink to='/dashboard' data-testid="mobile-dashboard" className={`${getLinkClass} text-black`} onClick={() => setIsMenuOpen(false)}>
                                        Dashboard
                                    </NavLink>
                                )}
                                {isLandlord && (
                                    <NavLink to='/landlord' data-testid="mobile-landlord" className={`${getLinkClass} text-black`} onClick={() => setIsMenuOpen(false)}>
                                        Landlord
                                    </NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink to='/admin' data-testid="mobile-admin" className={`${getLinkClass} text-black`} onClick={() => setIsMenuOpen(false)}>
                                        Admin
                                    </NavLink>
                                )}
                                <div className='px-3 py-2 space-y-2'>
                                    {isLoggedIn ? (
                                        <>
                                            <NavLink to="/messages" data-testid="mobile-messages" className="px-4 py-2 border rounded-md text-gray-700 hover:border-purple-600 transition-colors">
                                                <div className='relative p-2 hover:bg-slate-100 rounded-lg'>
                                                    <MessageSquare className="w-6 h-6 text-slate-600" /></div></NavLink>
                                                    <NavLink
                                                    to="/settings"
                                                    data-testid="mobile-settings"
                                                    className="px-4 py-2 border rounded-md text-gray-700 hover:border-purple-600 transition-colors"
                                                >
                                                    <div className='relative p-2 hover:bg-slate-100 rounded-lg'>
                                                    <IoSettingsOutline className="w-6 h-6 text-slate-600" /></div>
                                                </NavLink>
                                                <NavLink
                                                    to="/profile"
                                                    data-testid="mobile-profile"
                                                    className="px-4 py-2 border rounded-md text-gray-700 hover:border-purple-600 transition-colors"
                                                >
                                                    Profile
                                                </NavLink>
                                                <button onClick={handleLogout} data-testid="mobile-logout" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                                <LogOut className="w-6 h-6" />
                                                    Logout
                                                </button>
                                        </>
                                    ) : (
                                        <>
                                            <NavLink
                                                to="/login"
                                                data-testid="mobile-login"
                                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                            >
                                                Login
                                            </NavLink>
                                            <NavLink
                                                to="/register"
                                                data-testid="mobile-register"
                                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                            >
                                                Register
                                            </NavLink>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        );
    };

export default Header;