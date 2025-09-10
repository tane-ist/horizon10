import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helpers to manage local user profile (role, name, phone, etc.)
const USERS_STORAGE_KEY = 'tanepro_users';
const SESSION_USER_KEY = 'tanepro_user';

function getProfiles() {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function upsertProfile(profile) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) {
    profiles[idx] = { ...profiles[idx], ...profile };
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(profiles));
}

function findProfileByEmail(email) {
  const profiles = getProfiles();
  return profiles.find(p => p.email === email);
}

function findProfileById(id) {
  const profiles = getProfiles();
  return profiles.find(p => p.id === id);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Compose app user from Supabase session and local profile
  const buildAppUser = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data?.session || null;

    if (!session?.user) {
      localStorage.removeItem(SESSION_USER_KEY);
      setUser(null);
      setLoading(false);
      return;
    }

    const sbUser = session.user;
    const profile = findProfileById(sbUser.id) || findProfileByEmail(sbUser.email);

    const appUser = {
      id: sbUser.id,
      email: sbUser.email,
      name: profile?.name || sbUser.user_metadata?.name || '',
      role: profile?.role || sbUser.user_metadata?.role || 'customer',
      phone: profile?.phone || '',
      tabdkNo: profile?.tabdkNo || '',
      address: profile?.address || '',
      createdAt: profile?.createdAt || new Date().toISOString(),
    };

    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(appUser));
    setUser(appUser);
    setLoading(false);
  };

  useEffect(() => {
    // Initialize from current session
    buildAppUser();

    // Listen to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, _session) => {
      // Rebuild user whenever session changes
      buildAppUser();
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        await buildAppUser();
        return { success: true };
      }
      // Fallback to legacy local users if Supabase fails
      const users = getProfiles();
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (foundUser) {
        const appUser = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          phone: foundUser.phone,
          tabdkNo: foundUser.tabdkNo,
          address: foundUser.address,
          createdAt: foundUser.createdAt,
        };
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(appUser));
        setUser(appUser);
        return { success: true };
      }
      return { success: false, error: error.message };
    } catch (err) {
      // Final fallback
      const users = getProfiles();
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (foundUser) {
        const appUser = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          phone: foundUser.phone,
          tabdkNo: foundUser.tabdkNo,
          address: foundUser.address,
          createdAt: foundUser.createdAt,
        };
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(appUser));
        setUser(appUser);
        return { success: true };
      }
      return { success: false, error: err.message || 'Giriş başarısız' };
    }
  };

  const register = async (userData) => {
    const { email, password, name, role, phone, tabdkNo, address } = userData;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });
      if (error) {
        // Fallback to local-only registration
        const existing = findProfileByEmail(email);
        if (existing) return { success: false, error: 'Bu email adresi zaten kullanılıyor' };
        const newUser = {
          id: Date.now().toString(),
          email,
          name: name || '',
          role: role || 'customer',
          phone: phone || '',
          tabdkNo: tabdkNo || '',
          address: address || '',
          password,
          createdAt: new Date().toISOString(),
        };
        upsertProfile(newUser);
        return { success: true };
      }

      // Persist profile locally for role-based routing compatibility
      const sbUserId = data.user?.id;
      if (sbUserId) {
        upsertProfile({
          id: sbUserId,
          email,
          name: name || '',
          role: role || 'customer',
          phone: phone || '',
          tabdkNo: tabdkNo || '',
          address: address || '',
          createdAt: new Date().toISOString(),
        });
      }

      return { success: true };
    } catch (err) {
      // Fallback to local-only registration
      const existing = findProfileByEmail(email);
      if (existing) return { success: false, error: 'Bu email adresi zaten kullanılıyor' };
      const newUser = {
        id: Date.now().toString(),
        email,
        name: name || '',
        role: role || 'customer',
        phone: phone || '',
        tabdkNo: tabdkNo || '',
        address: address || '',
        password,
        createdAt: new Date().toISOString(),
      };
      upsertProfile(newUser);
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem(SESSION_USER_KEY);
      setUser(null);
    } catch (_) {
      localStorage.removeItem(SESSION_USER_KEY);
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, login, register, logout, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};