import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const CustomerOverview = () => {
  const { orders, cart, products } = useData();
  const { user } = useAuth();

  // Filter orders for current customer
  const myOrders = orders.filter(order => order.customerId === user?.id);
  
  const recentOrders = myOrders.slice(0, 3);
  const totalSpent = myOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  const stats = [
    {
      title: 'Toplam Sipariş',
      value: myOrders.length,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Sepetteki Ürün',
      value: cart.length,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Toplam Harcama',
      value: `₺${totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Bekleyen Sipariş',
      value: myOrders.filter(order => order.status === 'pending').length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">Hoş geldiniz, {user?.name}!</h2>
        <p className="text-green-100">Ürünleri keşfedin ve kolayca sipariş verin.</p>
        <Link to="/customer/products">
          <Button variant="secondary" className="mt-4">
            Ürünleri Keşfet
          </Button>
        </Link>
      </motion.div>

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
              <CardTitle>Son Siparişlerim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₺{(order.total || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Henüz sipariş bulunmuyor</p>
                )}
              </div>
              {myOrders.length > 3 && (
                <div className="mt-4 pt-4 border-t">
                  <Link to="/customer/orders">
                    <Button variant="outline" className="w-full">
                      Tüm Siparişleri Görüntüle
                    </Button>
                  </Link>
                </div>
              )}
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
              <CardTitle>Sepetim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      ₺{(item.sellingPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                {cart.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Sepetiniz boş</p>
                )}
              </div>
              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Link to="/customer/cart">
                    <Button className="w-full">
                      Sepeti Görüntüle ({cart.length} ürün)
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerOverview;