import { useState } from 'react';
import { FaBuilding } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/login/authSlice';
import { Menu, X, LogOut } from 'lucide-react';
import type { RootState } from '../app/store';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = !!user;
  const role = user?.role?.toLowerCase();
  const isAdmin = role === 'admin';
  const isLandlord = role === 'landlord';
  const isStudent = role === 'student';

  // Landlords should NOT see Browse Hostels
  const canBrowseHostels = !isLandlord;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-lg lg:text-xl font-semibold transition-colors duration-100 ${
      isActive ? "text-indigo-600 underline underline-offset-4" : "text-purple-600 hover:text-purple-700"
    }`;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200" data-testid="header">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center gap-2" data-testid="logo">
            <div className="bg-purple-600 p-2 rounded-lg">
              <FaBuilding className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              UniStay
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 text-black">
            <NavLink to="/" className={getLinkClass} data-testid="desktop-home">Home</NavLink>
            {canBrowseHostels && (
              <NavLink to="/hostels" className={getLinkClass} data-testid="desktop-search">Browse Hostels</NavLink>
            )}
            {isLoggedIn && isStudent && <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>}
            {isLoggedIn && isLandlord && <NavLink to="/landlord" className={getLinkClass}>Landlord</NavLink>}
            {isLoggedIn && isAdmin && <NavLink to="/admin" className={getLinkClass}>Admin</NavLink>}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <NavLink to="/profile" className="px-4 py-2 border rounded-md text-gray-900 hover:border-purple-600 transition-colors hover:bg-purple-50 hover:text-purple-700">
                  Profile
                </NavLink>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2">
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">Login</NavLink>
                <NavLink to="/register" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">Register</NavLink>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} data-testid="mobile-menu-button" className="text-gray-900 hover:text-purple-600 transition-colors duration-200">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-sm">
            <div className="px-4 py-3 space-y-1">
              <NavLink to="/" className={getLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
              {canBrowseHostels && (
                <NavLink to="/hostels" className={getLinkClass} onClick={() => setIsMenuOpen(false)}>Browse Hostels</NavLink>
              )}
              {isLoggedIn && isStudent && <NavLink to="/dashboard" className={getLinkClass} onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>}
              {isLoggedIn && isLandlord && <NavLink to="/landlord" className={getLinkClass} onClick={() => setIsMenuOpen(false)}>Landlord</NavLink>}
              {isLoggedIn && isAdmin && <NavLink to="/admin" className={getLinkClass} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>}

              <div className="border-t border-gray-200 pt-3 space-y-2">
                {isLoggedIn ? (
                  <>
                    <NavLink to="/profile" className="block px-4 py-2 border rounded-lg text-gray-900 hover:border-purple-600 transition-colors font-medium hover:bg-purple-50 hover:text-purple-700" onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </NavLink>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                    <NavLink to="/register" className="block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Register</NavLink>
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