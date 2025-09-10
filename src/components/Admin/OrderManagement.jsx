
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Search, Filter, MoreHorizontal, Eye, Truck, PackageCheck, PackageX, Package } from 'lucide-react';
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
      DropdownMenuSubContent,
      DropdownMenuPortal,
    } from '@/components/ui/dropdown-menu';
    import { useData } from '@/contexts/DataContext';
    import { toast } from '@/components/ui/use-toast';

    const OrderManagement = () => {
      const { orders, updateOrderStatus } = useData();
      const [searchTerm, setSearchTerm] = useState('');
      const [statusFilter, setStatusFilter] = useState('all');

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

      const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm.toLowerCase()) ||
                             (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      });

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
      
      const handleExport = () => {
        toast({
          title: '🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀'
        });
      };

      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h2>
              <p className="text-gray-600">Tüm siparişleri görüntüleyin ve yönetin</p>
            </div>
            <Button variant="outline" onClick={handleExport}>
              CSV İndir
            </Button>
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
                            <span className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">
                              {order.total ? `₺${order.total.toFixed(2)}` : '₺0.00'}
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
                                  Görüntüle
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                     <Truck className="h-4 w-4 mr-2" />
                                     <span>Durumu Değiştir</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                     <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'confirmed')}>
                                            <PackageCheck className="h-4 w-4 mr-2 text-blue-500" />
                                            Onaylandı
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>
                                            <Truck className="h-4 w-4 mr-2 text-yellow-500" />
                                            Kargoya Verildi
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>
                                            <PackageCheck className="h-4 w-4 mr-2 text-green-500" />
                                            Teslim Edildi
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'cancelled')}>
                                            <PackageX className="h-4 w-4 mr-2 text-red-500" />
                                            İptal Edildi
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
                      : 'Henüz hiç sipariş verilmemiş.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    };

    export default OrderManagement;
  