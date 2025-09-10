import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const ShoppingCart = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, createOrder } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + ((item.selling_price || item.sellingPrice) * item.quantity), 0);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast({
      title: 'Ürün sepetten çıkarıldı',
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Hata!',
        description: 'Sepetiniz boş.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerId: user?.id,
        customerName: user?.name,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.selling_price || item.sellingPrice
        })),
        total: total,
        address: user?.address || ''
      };

      createOrder(orderData);
      clearCart();
      
      toast({
        title: 'Başarılı!',
        description: 'Siparişiniz başarıyla oluşturuldu.',
      });
    } catch (error) {
      toast({
        title: 'Hata!',
        description: 'Sipariş oluşturulurken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sepetim</h2>
        <p className="text-gray-600">Sepetinizdeki ürünleri gözden geçirin ve sipariş verin</p>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sepetinizdeki Ürünler ({cart.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img  alt={`${item.name} ürün görseli`} className="w-full h-full object-cover rounded-lg" src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">₺{item.selling_price || item.sellingPrice} / adet</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₺{((item.selling_price || item.sellingPrice) * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span>₺{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo:</span>
                    <span>Ücretsiz</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Toplam:</span>
                      <span>₺{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Sipariş Veriliyor...' : 'Sipariş Ver'}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    clearCart();
                    toast({ title: 'Sepet temizlendi' });
                  }}
                >
                  Sepeti Temizle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sepetiniz boş</h3>
            <p className="text-gray-600 mb-4">Alışverişe başlamak için ürünleri keşfedin</p>
            <Button onClick={() => window.location.href = '/customer/products'}>
              Ürünleri Keşfet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShoppingCart;