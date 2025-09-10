import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const SupplierOverview = () => {
  const { products, orders } = useData();
  const { user } = useAuth();

  // Filter products and orders for current supplier
  const myProducts = products.filter(product => product.supplierId === user?.id);
  const myOrders = orders.filter(order => 
    order.items?.some(item => 
      myProducts.some(product => product.id === item.productId)
    )
  );

  const todayOrders = myOrders.filter(order => {
    const today = new Date().toDateString();
    return new Date(order.createdAt).toDateString() === today;
  });

  const totalRevenue = myOrders.reduce((sum, order) => {
    const orderTotal = order.items?.reduce((itemSum, item) => {
      const product = myProducts.find(p => p.id === item.productId);
      return itemSum + (product ? product.sellingPrice * item.quantity : 0);
    }, 0) || 0;
    return sum + orderTotal;
  }, 0);

  const totalUnitsSold = myOrders.reduce((sum, order) => {
    const orderUnits = order.items?.reduce((itemSum, item) => {
      const product = myProducts.find(p => p.id === item.productId);
      return itemSum + (product ? item.quantity : 0);
    }, 0) || 0;
    return sum + orderUnits;
  }, 0);

  const stats = [
    {
      title: 'Toplam Ürün',
      value: myProducts.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Bugünkü Siparişler',
      value: todayOrders.length,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Satılan Birim',
      value: totalUnitsSold,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Toplam Gelir',
      value: `₺${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
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
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">Hoş geldiniz, {user?.name}!</h2>
        <p className="text-blue-100">Tedarikçi panelinizden ürünlerinizi ve siparişlerinizi yönetebilirsiniz.</p>
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

      {/* Recent Products and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Son Eklenen Ürünler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">Stok: {product.stockQuantity}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      ₺{product.sellingPrice}
                    </span>
                  </div>
                ))}
                {myProducts.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Henüz ürün eklenmemiş</p>
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
              <CardTitle>Son Siparişler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                ))}
                {myOrders.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Henüz sipariş bulunmuyor</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SupplierOverview;