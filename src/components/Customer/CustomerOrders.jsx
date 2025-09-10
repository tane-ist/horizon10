import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Eye, Package } from 'lucide-react';
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
} from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const CustomerOrders = () => {
  const { orders } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter orders for current customer
  const myOrders = orders.filter(order => order.customerId === user?.id);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Beklemede', variant: 'warning' },
      confirmed: { label: 'Onaylandı', variant: 'default' },
      preparing: { label: 'Hazırlanıyor', variant: 'info' },
      in_transit: { label: 'Dağıtımda', variant: 'info' },
      delivered: { label: 'Teslim Edildi', variant: 'success' },
      cancelled: { label: 'İptal Edildi', variant: 'destructive' }
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: 'default' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const filteredOrders = myOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (order) => {
    toast({
      title: '🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Siparişlerim</h2>
        <p className="text-gray-600">Verdiğiniz siparişleri takip edin</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Sipariş ara (sipariş no)..."
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

      {/* Orders Table */}
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tarih</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ürün Sayısı</th>
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
                        <span className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-900">
                          {order.items?.length || 0} ürün
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">
                          ₺{(order.total || 0).toFixed(2)}
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
                  : 'Henüz hiç sipariş vermemişsiniz.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerOrders;