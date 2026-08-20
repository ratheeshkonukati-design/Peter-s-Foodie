import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ChefHat, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup, switchRole } = useAuth();
  const { success, error } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.trim()) {
        error('Please enter your email.');
        return;
      }
      const ok = login(email, role);
      if (ok) {
        success(`Welcome back to Peter's Foody!`);
        onClose();
      } else {
        error('Invalid credentials. Try using demo accounts below.');
      }
    } else {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        error('Please fill in all required fields.');
        return;
      }
      signup(name, email, phone, role);
      success(`Welcome to Peter's Foody, ${name}!`);
      onClose();
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    switchRole(demoRole);
    const roleLabels = {
      customer: 'Customer (Rohan Sharma)',
      restaurant_owner: 'Restaurant Owner (Spice Paradise)',
      admin: 'Platform Admin (Peter Fernandez)'
    };
    success(`Logged in as ${roleLabels[demoRole]}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-100 space-y-6 max-h-[95vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍴</span>
            <div>
              <h3 className="text-xl font-bold text-stone-900">Peter's Foody</h3>
              <p className="text-xs text-stone-500">Premium Food Delivered with Love</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Demo Accounts Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-current" />
            <span>Instant Demo Logins (1-Click)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-stone-800 text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex flex-col items-center gap-1 text-center"
            >
              <UserIcon className="w-4 h-4 text-orange-600" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('restaurant_owner')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-stone-800 text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex flex-col items-center gap-1 text-center"
            >
              <ChefHat className="w-4 h-4 text-amber-600" />
              <span>Owner</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-stone-800 text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex flex-col items-center gap-1 text-center"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                Account Type / Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    role === 'customer'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('restaurant_owner')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    role === 'restaurant_owner'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Restaurant Owner</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-stone-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
