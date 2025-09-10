
    import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { 
      LayoutDashboard, 
      Users, 
      UserCheck, 
      ShoppingCart,
      LayoutList,
      Package
    } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const AdminSidebar = () => {
      const location = useLocation();

      const menuItems = [
        {
          title: 'Genel Bakış',
          href: '/admin',
          icon: LayoutDashboard,
          active: location.pathname === '/admin'
        },
        {
          title: 'Tedarikçiler',
          href: '/admin/suppliers',
          icon: Users,
          active: location.pathname === '/admin/suppliers'
        },
        {
          title: 'Müşteriler',
          href: '/admin/customers',
          icon: UserCheck,
          active: location.pathname === '/admin/customers'
        },
        {
          title: 'Siparişler',
          href: '/admin/orders',
          icon: ShoppingCart,
          active: location.pathname === '/admin/orders'
        },
        {
          title: 'Kategoriler',
          href: '/admin/categories',
          icon: LayoutList,
          active: location.pathname === '/admin/categories'
        },
        {
          title: 'Ürünler',
          href: '/admin/products',
          icon: Package,
          active: location.pathname === '/admin/products'
        }
      ];

      return (
        <div className="space-y-2 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      );
    };

    export default AdminSidebar;
  