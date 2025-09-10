
    import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
    import { useToast } from '@/components/ui/use-toast';

    const AuthContext = createContext(undefined);

    export const AuthProvider = ({ children }) => {
      const { toast } = useToast();

      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      const handleLocalStorageAuth = useCallback(() => {
        try {
          const storedUser = localStorage.getItem('tanepro_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }, []);
      
      useState(() => {
        handleLocalStorageAuth();
      }, [handleLocalStorageAuth]);


      const signUp = useCallback(async (name, email, password, role, additionalInfo = {}) => {
        const users = JSON.parse(localStorage.getItem('tanepro_users') || '[]');
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            const error = { message: "Bu e-posta adresi zaten kullanımda." };
            toast({
                variant: "destructive",
                title: "Kayıt Başarısız",
                description: error.message,
            });
            return { user: null, error };
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            role,
            ...additionalInfo,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('tanepro_users', JSON.stringify(users));

        if (role === 'supplier') {
            const suppliers = JSON.parse(localStorage.getItem('tanepro_suppliers') || '[]');
            suppliers.push({
              id: newUser.id,
              name,
              email,
              phone: additionalInfo.phone || '',
              tabdkNo: additionalInfo.tabdkNo || '',
              address: additionalInfo.address || '',
              createdAt: newUser.createdAt
            });
            localStorage.setItem('tanepro_suppliers', JSON.stringify(suppliers));
        } else if (role === 'customer') {
            const customers = JSON.parse(localStorage.getItem('tanepro_customers') || '[]');
            customers.push({
              id: newUser.id,
              name,
              email,
              phone: additionalInfo.phone || '',
              tabdkNo: additionalInfo.tabdkNo || '',
              address: additionalInfo.address || '',
              createdAt: newUser.createdAt
            });
            localStorage.setItem('tanepro_customers', JSON.stringify(customers));
        }


        localStorage.setItem('tanepro_user', JSON.stringify(newUser));
        setUser(newUser);

        return { user: newUser, error: null };
      }, [toast]);

      const signIn = useCallback(async (email, password) => {
        const users = JSON.parse(localStorage.getItem('tanepro_users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            localStorage.setItem('tanepro_user', JSON.stringify(foundUser));
            setUser(foundUser);
            return { user: foundUser, error: null };
        } else {
            const error = { message: "Geçersiz e-posta veya şifre." };
            toast({
                variant: "destructive",
                title: "Giriş Başarısız",
                description: error.message,
            });
            return { user: null, error };
        }
      }, [toast]);

      const signOut = useCallback(async () => {
        localStorage.removeItem('tanepro_user');
        setUser(null);
        return { error: null };
      }, []);

      const value = useMemo(() => ({
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }), [user, loading, signUp, signIn, signOut]);

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
  