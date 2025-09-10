
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Search, MoreHorizontal, Eye, Package, Truck } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
      DropdownMenuSub,
      DropdownMenuSubTrigger,
      DropdownMenuPortal,
      DropdownMenuSubContent
    } from '@/components/ui/dropdown-menu';
    import { useData } from '@/contexts/DataContext';
    import { useAuth } from '@/contexts/AuthContext';
    import { toast } from '@/components/ui/use-toast';

    const SupplierOrders = () => {
      const { orders, products, updateOrderStatus } = useData();
      const { user } = useAuth();
      const [searchTerm, setSearchTerm] = useState('');
      const [statusFilter, setStatusFilter] = useState('all');

      const myProducts = products.filter(product => (product.supplier_id || product.supplierId) === user?.id);
      
      const myOrders = orders.filter(order => 
        order.items?.some(item => 
          myProducts.some(product => product.id === item.productId)
        )
      ).map(order => ({
        ...order,
        items: order.items?.filter(item => 
          myProducts.some(product => product.id === item.productId)
        ) || []
      }));

      const getStatusBadge = (status) => {
        const statusMap = {
          pending: { label: 'Beklemede', variant: 'warning' },
          confirmed: { label: 'Onaylandı', variant: 'default' },
          preparing: { label: 'Hazırlanıyor', variant: 'info' },
          in_transit: { label: 'Dağıtımda', variant: 'info' },
          delivered: { label: 'Teslim Edildi', variant: 'success' },
          cancelled: { label: 'İptal Edildi', variant: 'destructive' }
        };
        
        const statusInfo = statusMap[status] || { label: status, variant: 'secondary' };
        return <Badge variant={statusInfo.variant} className="capitalize">{statusInfo.label}</Badge>;
      };

      const filteredOrders = myOrders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm.toLowerCase()) ||
                             (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      });

      const calculateOrderTotal = (order) => {
        return order.items?.reduce((sum, item) => {
          const product = myProducts.find(p => p.id === item.productId);
          const price = product ? (product.selling_price || product.sellingPrice) : 0;
          return sum + (price * item.quantity);
        }, 0) || 0;
      };

      const handleView = (order) => {
        toast({
          title: '🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀'
        });
      };

      const handleStatusChange = async (orderId, newStatus) => {
        try {
          await updateOrderStatus(orderId, newStatus);
          toast({
            title: "Başarılı!",
            description: `Sipariş durumu "${newStatus}" olarak güncellendi.`,
            variant: "success",
          });
        } catch (error) {
          toast({
            title: "Hata!",
            description: "Sipariş durumu güncellenirken bir sorun oluştu.",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Siparişlerim</h2>
              <p className="text-gray-600">Ürünlerinizi içeren siparişleri görüntüleyin</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Sipariş ara (sipariş no, müşteri)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Durum filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="pending">Beklemede</SelectItem>
                    <SelectItem value="confirmed">Onaylandı</SelectItem>
                    <SelectItem value="preparing">Hazırlanıyor</SelectItem>
                    <SelectItem value="in_transit">Dağıtımda</SelectItem>
                    <SelectItem value="delivered">Teslim Edildi</SelectItem>
                    <SelectItem value="cancelled">İptal Edildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Siparişler ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Sipariş No</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Müşteri</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Ürünler</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Tarih</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Toplam</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Durum</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">#{order.id}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-900">{order.customerName || 'Bilinmeyen Müşteri'}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              {order.items?.map((item, idx) => {
                                const product = myProducts.find(p => p.id === item.productId);
                                return product ? (
                                  <div key={idx} className="text-gray-600">
                                    {product.name} x{item.quantity}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">
                              ₺{calculateOrderTotal(order).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(order)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Detayları Görüntüle
                                </DropdownMenuItem>
                                 <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                     <Truck className="h-4 w-4 mr-2" />
                                     <span>Durumu Değiştir</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                     <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'confirmed')}>
                                            <Truck className="h-4 w-4 mr-2 text-blue-500" />
                                            Onaylandı
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'preparing')}>
                                            <Truck className="h-4 w-4 mr-2 text-orange-500" />
                                            Hazırlanıyor
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'in_transit')}>
                                            <Truck className="h-4 w-4 mr-2 text-yellow-500" />
                                            Dağıtımda
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>
                                            <Truck className="h-4 w-4 mr-2 text-green-500" />
                                            Teslim Edildi
                                        </DropdownMenuItem>
                                     </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sipariş bulunamadı</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Arama kriterlerinize uygun sipariş bulunamadı.' 
                      : 'Henüz ürünlerinizi içeren sipariş bulunmuyor.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    };

    export default SupplierOrders;
  