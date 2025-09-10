
    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';

    const DataContext = createContext();

    export const useData = () => {
      const context = useContext(DataContext);
      if (!context) {
        throw new Error('useData must be used within a DataProvider');
      }
      return context;
    };

    export const DataProvider = ({ children }) => {
      const [suppliers, setSuppliers] = useState([]);
      const [customers, setCustomers] = useState([]);
      const [products, setProducts] = useState([]);
      const [categories, setCategories] = useState([]);
      const [orders, setOrders] = useState([]);
      const [cart, setCart] = useState([]);

      const fetchCategoriesFromSupabase = async () => {
        try {
          const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
          if (error) throw error;
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            localStorage.setItem('tanepro_categories', JSON.stringify(data));
            return true;
          }
          return false;
        } catch (_) {
          return false;
        }
      };

      const fetchProducts = async () => {
        try {
          const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
          if (error) throw error;
          if (Array.isArray(data)) {
            setProducts(data);
            localStorage.setItem('tanepro_products', JSON.stringify(data));
            return true;
          }
          return false;
        } catch (_) {
          const localProducts = localStorage.getItem('tanepro_products');
          if (localProducts) {
            setProducts(JSON.parse(localProducts));
          }
          return false;
        }
      };

      const seedCategories = [
        { id: 5, name: 'Bira', description: 'Çeşitli bira türleri' },
        { id: 6, name: 'Şarap', description: 'Kırmızı, beyaz ve roze şaraplar' },
        { id: 7, name: 'Viski', description: 'Scotch, Bourbon, Irish ve diğer viskiler' },
        { id: 8, name: 'Rakı', description: 'Türk anasonlu alkollü içki' },
        { id: 9, name: 'Votka', description: 'Saf ve aromalı votka çeşitleri' },
        { id: 10, name: 'Cin', description: 'Çeşitli botaniklerle tatlandırılmış cinler' },
        { id: 11, name: 'Tekila', description: 'Mavi agave bitkisinden yapılan tekila' },
        { id: 12, name: 'Konyak', description: 'Fransız konyakları ve brendiler' },
        { id: 13, name: 'Likör', description: 'Farklı tatlarda likörler' },
        { id: 14, name: 'Rom', description: 'Beyaz, koyu ve altın romlar' },
        { id: 15, name: 'Şampanya', description: 'Köpüklü şaraplar ve şampanyalar' }
      ];

      useEffect(() => {
        initializeData();
      }, []);

      const initializeData = () => {
        const existingCategories = localStorage.getItem('tanepro_categories');
        if (existingCategories) {
          setCategories(JSON.parse(existingCategories));
        }
        // Try Supabase, fallback to seeding if nothing exists locally or remotely
        fetchCategoriesFromSupabase().then((ok) => {
          if (!ok && !existingCategories) {
            localStorage.setItem('tanepro_categories', JSON.stringify(seedCategories));
            setCategories(seedCategories);
          }
        });

        const existingSuppliers = localStorage.getItem('tanepro_suppliers');
        const existingCustomers = localStorage.getItem('tanepro_customers');
        const existingProducts = localStorage.getItem('tanepro_products');
        const existingOrders = localStorage.getItem('tanepro_orders');
        const existingUsers = localStorage.getItem('tanepro_users');

        if (!existingUsers) {
          const seedUsers = [
            {
              id: '1',
              name: 'Admin Kullanıcı',
              email: 'admin@tanepro.com',
              password: 'admin123',
              role: 'admin',
              phone: '+90 555 123 4567',
              tabdkNo: 'ADM001',
              address: 'İstanbul, Türkiye',
              createdAt: new Date().toISOString()
            },
            // Tedarikçiler
            {
              id: '2',
              name: 'Premium İçecek Tedarikçisi',
              email: 'supplier@tanepro.com',
              password: 'supplier123',
              role: 'supplier',
              phone: '+90 555 234 5678',
              tabdkNo: 'SUP001',
              address: 'Ankara, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '4',
              name: 'Elit Alkol Distribütörü',
              email: 'elit@tanepro.com',
              password: 'elit123',
              role: 'supplier',
              phone: '+90 555 456 7890',
              tabdkNo: 'SUP002',
              address: 'İstanbul, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '5',
              name: 'Anadolu İçecek A.Ş.',
              email: 'anadolu@tanepro.com',
              password: 'anadolu123',
              role: 'supplier',
              phone: '+90 555 567 8901',
              tabdkNo: 'SUP003',
              address: 'Bursa, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '6',
              name: 'Marmara Şarap Evi',
              email: 'marmara@tanepro.com',
              password: 'marmara123',
              role: 'supplier',
              phone: '+90 555 678 9012',
              tabdkNo: 'SUP004',
              address: 'Tekirdağ, Türkiye',
              createdAt: new Date().toISOString()
            },
            // Müşteriler
            {
              id: '3',
              name: 'Müşteri Firma',
              email: 'customer@tanepro.com',
              password: 'customer123',
              role: 'customer',
              phone: '+90 555 345 6789',
              tabdkNo: 'CUS001',
              address: 'İzmir, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '7',
              name: 'Lüks Restoran Zinciri',
              email: 'luxury@tanepro.com',
              password: 'luxury123',
              role: 'customer',
              phone: '+90 555 789 0123',
              tabdkNo: 'CUS002',
              address: 'Antalya, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '8',
              name: 'Metro Market A.Ş.',
              email: 'metro@tanepro.com',
              password: 'metro123',
              role: 'customer',
              phone: '+90 555 890 1234',
              tabdkNo: 'CUS003',
              address: 'İstanbul, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '9',
              name: 'Ege Otel Grubu',
              email: 'ege@tanepro.com',
              password: 'ege123',
              role: 'customer',
              phone: '+90 555 901 2345',
              tabdkNo: 'CUS004',
              address: 'Muğla, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '10',
              name: 'Karadeniz Bar & Restoran',
              email: 'karadeniz@tanepro.com',
              password: 'karadeniz123',
              role: 'customer',
              phone: '+90 555 012 3456',
              tabdkNo: 'CUS005',
              address: 'Trabzon, Türkiye',
              createdAt: new Date().toISOString()
            }
          ];
          localStorage.setItem('tanepro_users', JSON.stringify(seedUsers));
        }

        if (!existingSuppliers) {
          const seedSuppliers = [
            {
              id: '2',
              name: 'Premium İçecek Tedarikçisi',
              phone: '+90 555 234 5678',
              email: 'supplier@tanepro.com',
              tabdkNo: 'SUP001',
              address: 'Ankara, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '4',
              name: 'Elit Alkol Distribütörü',
              phone: '+90 555 456 7890',
              email: 'elit@tanepro.com',
              tabdkNo: 'SUP002',
              address: 'İstanbul, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '5',
              name: 'Anadolu İçecek A.Ş.',
              phone: '+90 555 567 8901',
              email: 'anadolu@tanepro.com',
              tabdkNo: 'SUP003',
              address: 'Bursa, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '6',
              name: 'Marmara Şarap Evi',
              phone: '+90 555 678 9012',
              email: 'marmara@tanepro.com',
              tabdkNo: 'SUP004',
              address: 'Tekirdağ, Türkiye',
              createdAt: new Date().toISOString()
            }
          ];
          localStorage.setItem('tanepro_suppliers', JSON.stringify(seedSuppliers));
          setSuppliers(seedSuppliers);
        } else {
          setSuppliers(JSON.parse(existingSuppliers));
        }

        if (!existingCustomers) {
          const seedCustomers = [
            {
              id: '3',
              name: 'Müşteri Firma',
              phone: '+90 555 345 6789',
              email: 'customer@tanepro.com',
              tabdkNo: 'CUS001',
              address: 'İzmir, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '7',
              name: 'Lüks Restoran Zinciri',
              phone: '+90 555 789 0123',
              email: 'luxury@tanepro.com',
              tabdkNo: 'CUS002',
              address: 'Antalya, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '8',
              name: 'Metro Market A.Ş.',
              phone: '+90 555 890 1234',
              email: 'metro@tanepro.com',
              tabdkNo: 'CUS003',
              address: 'İstanbul, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '9',
              name: 'Ege Otel Grubu',
              phone: '+90 555 901 2345',
              email: 'ege@tanepro.com',
              tabdkNo: 'CUS004',
              address: 'Muğla, Türkiye',
              createdAt: new Date().toISOString()
            },
            {
              id: '10',
              name: 'Karadeniz Bar & Restoran',
              phone: '+90 555 012 3456',
              email: 'karadeniz@tanepro.com',
              tabdkNo: 'CUS005',
              address: 'Trabzon, Türkiye',
              createdAt: new Date().toISOString()
            }
          ];
          localStorage.setItem('tanepro_customers', JSON.stringify(seedCustomers));
          setCustomers(seedCustomers);
        } else {
          setCustomers(JSON.parse(existingCustomers));
        }

        fetchProducts(); 

        if (existingOrders) {
          setOrders(JSON.parse(existingOrders));
        }
      };

      const addSupplier = (supplier) => {
        const newSupplier = {
          ...supplier,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        const updatedSuppliers = [...suppliers, newSupplier];
        setSuppliers(updatedSuppliers);
        localStorage.setItem('tanepro_suppliers', JSON.stringify(updatedSuppliers));
        return newSupplier;
      };

      const addCustomer = (customer) => {
        const newCustomer = {
          ...customer,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        const updatedCustomers = [...customers, newCustomer];
        setCustomers(updatedCustomers);
        localStorage.setItem('tanepro_customers', JSON.stringify(updatedCustomers));
        return newCustomer;
      };

      const addProduct = async (productData) => {
        const newProduct = {
          ...productData,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        
        const currentProducts = products;
        setProducts(prevProducts => [...prevProducts, newProduct]);

        try {
            const { error } = await supabase.from('products').insert(newProduct);
            if (error) throw error;
            const updatedProductsForStorage = [...currentProducts, newProduct];
            localStorage.setItem('tanepro_products', JSON.stringify(updatedProductsForStorage));
            await fetchProducts(); 
            return newProduct;
        } catch(error) {
            setProducts(currentProducts);
            throw error; 
        }
      };
      
      const addMultipleProducts = async (newProducts) => {
        const productsWithTimestamps = newProducts.map(p => ({
            ...p,
            id: Date.now().toString() + Math.random(), 
            created_at: new Date().toISOString()
        }));

        const currentProducts = products;
        setProducts(prevProducts => [...prevProducts, ...productsWithTimestamps]);
        
        try {
            const { error } = await supabase.from('products').insert(productsWithTimestamps);
            if (error) throw error;
            const updatedProductsForStorage = [...currentProducts, ...productsWithTimestamps];
            localStorage.setItem('tanepro_products', JSON.stringify(updatedProductsForStorage));
            await fetchProducts();
            return productsWithTimestamps;
        } catch (error) {
            setProducts(currentProducts); 
            throw error;
        }
    };

      const updateProduct = (productId, updates) => {
        const updatedProducts = products.map(p =>
            p.id === productId ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
        );
        setProducts(updatedProducts);
        localStorage.setItem('tanepro_products', JSON.stringify(updatedProducts));
        // Fire-and-forget update to Supabase (non-blocking)
        supabase.from('products').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', productId);
      };

      const deleteProduct = (productId) => {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('tanepro_products', JSON.stringify(updatedProducts));
        // Fire-and-forget delete to Supabase
        supabase.from('products').delete().eq('id', productId);
      };

      const addCategory = (category) => {
        const newCategory = {
          ...category,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        localStorage.setItem('tanepro_categories', JSON.stringify(updatedCategories));
        // Try insert into Supabase (ignore errors, keep local)
        supabase.from('categories').insert(newCategory);
        return newCategory;
      };

      const updateCategory = (categoryId, updates) => {
        const updatedCategories = categories.map(c => 
          c.id === categoryId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        );
        setCategories(updatedCategories);
        localStorage.setItem('tanepro_categories', JSON.stringify(updatedCategories));
        supabase.from('categories').update({ ...updates, updatedAt: new Date().toISOString() }).eq('id', categoryId);
      };

      const deleteCategory = (categoryId) => {
        const updatedCategories = categories.filter(c => c.id !== categoryId);
        setCategories(updatedCategories);
        localStorage.setItem('tanepro_categories', JSON.stringify(updatedCategories));
        supabase.from('categories').delete().eq('id', categoryId);
      };
      
      const uploadImage = async (file) => {
        // Supabase bağlantısı kaldırıldığı için bu fonksiyon artık bir şey yapmayacak.
        // Geçici olarak null döndürüyoruz.
        console.warn("Image upload functionality is disabled as Supabase is disconnected.");
        return null;
      };

      const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
          setCart(cart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ));
        } else {
          setCart([...cart, { ...product, quantity }]);
        }
      };

      const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
      };

      const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) {
          removeFromCart(productId);
        } else {
          setCart(cart.map(item => 
            item.id === productId ? { ...item, quantity } : item
          ));
        }
      };

      const clearCart = () => {
        setCart([]);
      };

      const createOrder = (orderData) => {
        const newOrder = {
          ...orderData,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('tanepro_orders', JSON.stringify(updatedOrders));
        return newOrder;
      };

      const updateOrderStatus = async (orderId, status) => {
        const currentOrders = orders;
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
        );
        setOrders(updatedOrders);

        try {
            localStorage.setItem('tanepro_orders', JSON.stringify(updatedOrders));
        } catch (error) {
            setOrders(currentOrders);
            console.error("Sipariş durumu güncellenirken hata oluştu:", error);
            throw error;
        }
      };


      const value = {
        suppliers,
        customers,
        products,
        categories,
        orders,
        cart,
        addSupplier,
        addCustomer,
        addProduct,
        addMultipleProducts,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        uploadImage,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        updateOrderStatus
      };

      return (
        <DataContext.Provider value={value}>
          {children}
        </DataContext.Provider>
      );
    };
  