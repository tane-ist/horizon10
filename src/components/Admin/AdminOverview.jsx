import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

const AdminOverview = () => {
  const { suppliers, customers, orders, products } = useData();

  const stats = [
    {
      title: 'Toplam Tedarikçi',
      value: suppliers.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Toplam Müşteri',
      value: customers.length,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Toplam Sipariş',
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Toplam Ürün',
      value: products.length,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Son Tedarikçiler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.slice(0, 5).map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-gray-600">{supplier.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(supplier.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                ))}
                {suppliers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Henüz tedarikçi bulunmuyor</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Son Müşteriler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                ))}
                {customers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Henüz müşteri bulunmuyor</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;