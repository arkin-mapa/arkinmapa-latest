import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Settings } from 'lucide-react';
import { useStore } from '../store';

export function Navbar() {
  const isAdmin = useStore((state) => state.isAdmin);
  const toggleAdmin = useStore((state) => state.toggleAdmin);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              WiFi Store
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <Link 
                to="/admin"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                Admin Panel
              </Link>
            ) : (
              <Link 
                to="/dashboard"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={toggleAdmin}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-emerald-600 transition-all duration-200"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}