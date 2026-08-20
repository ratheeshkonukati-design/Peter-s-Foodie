import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building,
  Home,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Address, UserRole } from '../types';

interface UserProfilePageProps {
  onNavigate: (path: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onNavigate }) => {
  const { user, addresses, addAddress, removeAddress, setDefaultAddress, updateProfile, switchRole, role } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState<'home' | 'work' | 'other'>('home');
  const [newLine, setNewLine] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newZip, setNewZip] = useState('560038');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Please Sign In</h2>
        <p className="text-xs text-stone-500">Sign in to view your profile and saved delivery addresses.</p>
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone });
    setIsEditingProfile(false);
    success('Profile updated successfully!');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine.trim() || !newStreet.trim()) {
      error('Please complete the address details.');
      return;
    }
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      addressLine: newLine.trim(),
      street: newStreet.trim(),
      city: newCity,
      state: 'Karnataka',
      zipCode: newZip,
      isDefault: addresses.length === 0,
    };
    addAddress(newAddr);
    setIsAddingAddress(false);
    setNewLine('');
    setNewStreet('');
    success('New address added!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Account & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your personal profile, addresses, and portal roles
          </p>
        </div>

        {/* 1-Click Role Switcher Demo */}
        <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-current" /> Role:
          </span>
          <div className="flex gap-1">
            {(['customer', 'restaurant_owner', 'admin'] as UserRole[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  switchRole(r);
                  success(`Switched role to: ${r}`);
                  if (r === 'restaurant_owner') onNavigate('/restaurant-dashboard');
                  if (r === 'admin') onNavigate('/admin');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all capitalize ${
                  role === r
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-white text-stone-700 hover:bg-amber-100/60 border border-amber-200'
                }`}
              >
                {r === 'restaurant_owner' ? 'Owner' : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-orange-500/20"
              />
              <div>
                <h3 className="font-bold text-base text-stone-900">{user.name}</h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase mt-1">
                  {user.role}
                </span>
              </div>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 pt-2 text-xs text-stone-600 border-t border-stone-100">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-stone-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span>{user.phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full mt-2 py-2 rounded-xl border border-stone-200 hover:border-orange-500 text-stone-700 hover:text-orange-600 font-bold transition-all text-xs"
                >
                  Edit Profile Information
                </button>
              </div>
            )}
          </div>

          {/* Member badge perk */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 to-stone-900 text-white space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Peter's Foody Gourmet Club</span>
            </div>
            <h4 className="text-base font-black">Enjoy Zero Delivery Fees</h4>
            <p className="text-xs text-stone-300">
              Orders above ₹499 automatically qualify for VIP priority courier dispatch.
            </p>
          </div>
        </div>

        {/* Saved Addresses List */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span>Saved Delivery Addresses</span>
              </h3>
              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {isAddingAddress ? (
              <form onSubmit={handleCreateAddress} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex gap-2 mb-1">
                  {(['home', 'work', 'other'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setNewLabel(l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        newLabel === l ? 'bg-orange-600 text-white' : 'bg-white text-stone-700 border'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Flat / Building</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 101, Prestige Heights"
                    value={newLine}
                    onChange={e => setNewLine(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border text-xs focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">Street & Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 5th Block, Koramangala"
                    value={newStreet}
                    onChange={e => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={newZip}
                      onChange={e => setNewZip(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 bg-stone-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white text-stone-700 shadow-2xs">
                        {addr.label === 'home' ? (
                          <Home className="w-4 h-4 text-emerald-600" />
                        ) : addr.label === 'work' ? (
                          <Briefcase className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Building className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase text-stone-900">{addr.label}</span>
                          {addr.isDefault ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              Default
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setDefaultAddress(addr.id);
                                success('Set as default delivery address');
                              }}
                              className="text-[10px] text-orange-600 hover:underline font-semibold"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {addr.addressLine}, {addr.street}, {addr.city} - {addr.zipCode}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        removeAddress(addr.id);
                        success('Address removed');
                      }}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      aria-label="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
