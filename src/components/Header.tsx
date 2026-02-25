import { useState, useEffect } from 'react';
import { FaBuilding } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { logout } from '../features/login/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X, MessageSquare, LogOut } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const token = localStorage.getItem('Token');
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const isAdmin = user.role === 'admin';
    const isLandlord = user.role === 'doctor';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(!!token);
    }, [token, user]);

    useEffect(() => {
        if (isLoggedIn) {
            loadUnreadMessages();
        }
    }, [isLoggedIn, token]);

    const loadUnreadMessages = async () => {
        try {
            const messages = await fetch('/api/messages/unread', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await messages.json();
            setUnreadMessages(data.length);
            data.forEach((message: any) => {
                if (!message.seen) {
                    setUnreadMessages((prev) => prev + 1);
                }
            })
        } catch (error) {}
    }

    const handleLogout = () => {
        localStorage.removeItem('Token');
        localStorage.removeItem('User');
        dispatch(logout());
        setIsLoggedIn(false);
        setIsMenuOpen(false);
        navigate('/login');
    };

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        `text-base lg:text-lg font-semibold transition-colors duration-100 ${
            isActive ? "text-indigo-600 underline underline-offset-4" : "text-gray-600 hover: text-purple-600"
        }`;

        return (
            <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200" data-testid="header">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className='flex items-center justify-between h-16'>
                        <NavLink to="/" className="flex items-center gap-2" data-testid="logo">
                        <div className='bg-purple-600 p-2 rounded-lg'>
                            <FaBuilding className="w-6 h-6 text-white" />
                            </div>
                            <span className='text-xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent'>UniStay</span>
                            </NavLink>
                            <div className='text-black text-xl'>
                            <nav className="hidden md:flex space-x-8">
                                <NavLink to="/" className={getLinkClass} data-testid="desktop-home">Home</NavLink>
                                <NavLink to="/hostels" className={getLinkClass} data-testid="desktop-search">
                                Browse Hostels</NavLink>
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
                            </div>

                            {/* Desktop CTA Buttons */}
                            <div className="hidden md:flex items-center space-x-2">
                                {isLoggedIn ? (
                                <>
                                    <NavLink to="/messages" data-testid="desktop-messages" className="px-2 py-2 text-gray-900 transition-colors">
                                    <div className='relative p-2 hover:bg-slate-100 rounded-lg'>
                                        <MessageSquare className="w-6 h-6 text-slate-900" />
                                        {unreadMessages > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {unreadMessages}
                                        </span>
                                        )}</div></NavLink>
                                    <NavLink
                                        to="/profile"
                                        data-testid="desktop-profile"
                                        className="px-4 py-2 border rounded-md text-gray-900 hover:border-purple-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                                    >
                                        Profile
                                    </NavLink>
                                    <button onClick={handleLogout} data-testid="desktop-logout" className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                                    <LogOut className="w-3 h-3" />
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
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} data-testid="mobile-menu-button" className='text-gray-900 hover:text-purple-600 transition-colors duration-200'>
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className='md:hidden'>
                            <div className="bg-white border-t shadow-sm">
                            <div className='px-4 py-3 space-y-1'>
                                <NavLink to='/' data-testid="mobile-home" className={`${getLinkClass} text-black`} onClick={() => setIsMenuOpen(false)}>
                                    Home
                                </NavLink>
                                <NavLink to='/hostels' data-testid="mobile-search" className={`${getLinkClass} block text-black`} onClick={() => setIsMenuOpen(false)}>
                                    Browse Hostels
                                </NavLink>
                                {isLoggedIn && (
                                    <NavLink to='/dashboard' data-testid="mobile-dashboard" className={`${getLinkClass} block text-black`} onClick={() => setIsMenuOpen(false)}>
                                        Dashboard
                                    </NavLink>
                                )}
                                {isLandlord && (
                                    <NavLink to='/landlord' data-testid="mobile-landlord" className={`${getLinkClass} block text-black`} onClick={() => setIsMenuOpen(false)}>
                                        Landlord
                                    </NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink to='/admin' data-testid="mobile-admin" className={`${getLinkClass} block text-black`} onClick={() => setIsMenuOpen(false)}>
                                        Admin
                                    </NavLink>
                                )}
                                <div className='border-t border-gray-200'>
                                <div className='px-4 py-3 space-y-3'>
                                    {isLoggedIn ? (
                                        <>
                                        <div className='flex justify-center gap-3'>
                                            <NavLink to="/messages" data-testid="mobile-messages" className="mobile-icon-button">
                                                <div className='relative p-2 hover:bg-slate-200 rounded-lg'>
                                                    <MessageSquare className="w-8 h-8 text-slate-900" />
                                                    {unreadMessages > 0 && (
                                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                    {unreadMessages}
                                                    </span>
                                                    )}</div></NavLink>
                                                <div className='flex gap-2'>
                                                <NavLink
                                                    to="/profile"
                                                    data-testid="mobile-profile"
                                                    className="flex-1 px-4 py-2 border rounded-lg text-gray-900 hover:border-purple-600 transition-colors font-medium hover:bg-purple-50 hover:text-purple-700"
                                                >
                                                    Profile
                                                </NavLink>
                                                <button onClick={handleLogout} data-testid="mobile-logout" className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                                                <LogOut className="w-3 h-3" />
                                                    Logout
                                                </button>
                                        </div>
                                        </div>
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
                            </div>
                        </div>
                    )}
                </div>
            </header>
        );
    };

export default Header;