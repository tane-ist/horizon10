import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('tanepro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication - in real app, this would call an API
    const users = JSON.parse(localStorage.getItem('tanepro_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        phone: foundUser.phone,
        tabdkNo: foundUser.tabdkNo,
        address: foundUser.address
      };
      setUser(userSession);
      localStorage.setItem('tanepro_user', JSON.stringify(userSession));
      return { success: true };
    }
    
    return { success: false, error: 'Geçersiz email veya şifre' };
  };

  const register = async (userData) => {
    const users = JSON.parse(localStorage.getItem('tanepro_users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Bu email adresi zaten kullanılıyor' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('tanepro_users', JSON.stringify(users));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tanepro_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};