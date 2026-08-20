import React, { createContext, useContext, useEffect, useState } from 'react';
import { Address, User, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, role?: UserRole) => boolean;
  signup: (name: string, email: string, phone: string, role: UserRole) => User;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => Address;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  defaultAddress: Address | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (user) {
      setAddresses(StorageService.getAddresses(user.id));
    } else {
      setAddresses([]);
    }
  }, [user]);

  const login = (email: string, role?: UserRole): boolean => {
    const loggedUser = StorageService.login(email, role);
    if (loggedUser) {
      setUser(loggedUser);
      setAddresses(StorageService.getAddresses(loggedUser.id));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, phone: string, role: UserRole): User => {
    const newUser = StorageService.signup(name, email, phone, role);
    setUser(newUser);
    setAddresses([]);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setAddresses([]);
  };

  const switchRole = (newRole: UserRole) => {
    const allUsers = StorageService.getUsers();
    let targetUser = allUsers.find(u => u.role === newRole);
    if (!targetUser) {
      targetUser = {
        id: `user-${newRole}-${Date.now()}`,
        name: newRole === 'admin' ? 'Peter Fernandez (Admin)' : newRole === 'restaurant_owner' ? 'Vikram Malhotra (Owner)' : 'Rohan Sharma',
        email: `${newRole}@petersfoody.com`,
        phone: '+91 98765 43210',
        role: newRole,
        restaurantId: newRole === 'restaurant_owner' ? 'rest-1' : undefined,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      allUsers.push(targetUser);
    }
    StorageService.setCurrentUser(targetUser);
    setUser(targetUser);
    setAddresses(StorageService.getAddresses(targetUser.id));
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = StorageService.updateUser({ id: user.id, ...data });
    setUser(updated);
  };

  const addAddress = (addrData: Omit<Address, 'id' | 'userId'>): Address => {
    if (!user) throw new Error('Not logged in');
    const newAddress: Address = {
      ...addrData,
      id: `addr-${Date.now()}`,
      userId: user.id,
      isDefault: addresses.length === 0 ? true : addrData.isDefault
    };
    const saved = StorageService.saveAddress(newAddress);
    setAddresses(StorageService.getAddresses(user.id));
    return saved;
  };

  const deleteAddress = (id: string) => {
    StorageService.deleteAddress(id);
    if (user) {
      setAddresses(StorageService.getAddresses(user.id));
    }
  };

  const setDefaultAddress = (id: string) => {
    const addr = addresses.find(a => a.id === id);
    if (addr && user) {
      StorageService.saveAddress({ ...addr, isDefault: true });
      setAddresses(StorageService.getAddresses(user.id));
    }
  };

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || 'customer',
        login,
        signup,
        logout,
        switchRole,
        updateProfile,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        defaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
