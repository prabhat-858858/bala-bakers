import React from 'react';
import { Outlet, Link, NavLink, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cake,
  PlusCircle,
  ClipboardList,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF4]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#082B59] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#082B59]">Verifying Owner Authentication...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch {
      // Ignored
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'Products & Prices', path: '/admin/products', end: false, icon: Cake },
    { name: 'Add New Cake', path: '/admin/products/new', end: true, icon: PlusCircle },
    { name: 'Order Ledger', path: '/admin/orders', end: false, icon: ClipboardList },
    { name: 'Shop Settings', path: '/admin/settings', end: false, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-[#082B59] flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="bg-[#082B59] text-[#FFF0D9] border-b-2 border-[#D8B46A] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF0D9] flex items-center justify-center text-[#082B59] border border-[#D8B46A]">
              <ShieldCheck className="w-4 h-4 text-[#082B59]" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white leading-none block">
                Bela Bakers
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#D8B46A] font-semibold">
                Owner Dashboard
              </span>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF0D9] border border-[#D8B46A]/40 transition-colors"
            >
              <span>View Customer Site</span>
              <ExternalLink className="w-3 h-3 text-[#D8B46A]" />
            </Link>

            <span className="hidden md:inline-block text-[#FFF0D9]/70 border-l border-white/20 pl-3">
              {admin.email}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-700/80 hover:bg-rose-700 text-white font-semibold shadow-sm transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-white border-b border-[#D8B46A]/30 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#082B59] text-[#FFF0D9] shadow-sm'
                      : 'text-[#082B59]/75 hover:bg-[#FFF0D9]/60 hover:text-[#082B59]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
