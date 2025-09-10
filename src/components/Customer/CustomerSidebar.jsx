import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';

const CustomerSidebar = () => {
  const location = useLocation();
  const { cart } = useData();

  const menuItems = [
    {
      title: 'Genel Bakış',
      href: '/customer',
      icon: LayoutDashboard,
      active: location.pathname === '/customer'
    },
    {
      title: 'Ürünler',
      href: '/customer/products',
      icon: Package,
      active: location.pathname === '/customer/products'
    },
    {
      title: 'Siparişlerim',
      href: '/customer/orders',
      icon: ShoppingBag,
      active: location.pathname === '/customer/orders'
    },
    {
      title: 'Sepetim',
      href: '/customer/cart',
      icon: ShoppingCart,
      active: location.pathname === '/customer/cart',
      badge: cart.length > 0 ? cart.length : null
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
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                item.active
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CustomerSidebar;