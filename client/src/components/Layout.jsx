import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, UserPlus, List, FileText, User } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link to={to} className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            <Icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{label}</span>
        </Link>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-indigo-600">PlacementPortal</h1>
                    <p className="text-sm text-gray-500 mt-1">{user?.role} Dashboard</p>
                </div>

                <nav className="flex-1 mt-6">
                    {user?.role === 'ADMIN' && (
                        <>
                            <NavItem to="/admin/dashboard" icon={Home} label="Dashboard" />
                            <NavItem to="/admin/coordinators" icon={UserPlus} label="Coordinators" />
                            <NavItem to="/admin/feedbacks" icon={List} label="All Feedbacks" />
                        </>
                    )}

                    {user?.role === 'COORDINATOR' && (
                        <>
                            <NavItem to="/coordinator/dashboard" icon={Home} label="Pending Reviews" />
                            <NavItem to="/coordinator/approved" icon={List} label="Approved Feedbacks" />
                        </>
                    )}

                    {user?.role === 'STUDENT' && (
                        <>
                            <NavItem to="/student/submit" icon={FileText} label="Submit Feedback" />
                            <NavItem to="/student/feedbacks" icon={List} label="View Feedbacks" />
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
