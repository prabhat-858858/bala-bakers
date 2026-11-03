import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, Cake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid owner credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-full bg-[#082B59] border-2 border-[#D8B46A] flex items-center justify-center text-[#FFF0D9] shadow-md group-hover:scale-105 transition-transform">
            <Cake className="w-6 h-6 text-[#D8B46A]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#082B59]">
            Bela Bakers
          </span>
        </Link>
        <h1 className="font-serif text-2xl font-bold text-[#082B59]">
          Owner Administration Portal
        </h1>
        <p className="text-xs text-[#082B59]/75">
          Sign in to manage product prices, weight variants, catalogue availability, and manual WhatsApp order records.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#D8B46A]/40 shadow-card space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#082B59] mb-1">
                Owner Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@belabakers.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] shadow-sm"
                />
                <Mail className="w-4 h-4 text-[#082B59]/40 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#082B59] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] shadow-sm"
                />
                <Lock className="w-4 h-4 text-[#082B59]/40 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#D8B46A]" />
                <span>{loading ? 'Authenticating...' : 'Sign In as Owner'}</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#D8B46A]/20 text-center space-y-3">
            <p className="text-[11px] text-[#082B59]/60 leading-relaxed">
              Protected route with bcrypt password hashing and HTTP-only session cookies. Public self-registration is disabled.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#082B59] hover:text-[#BC964B] font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
