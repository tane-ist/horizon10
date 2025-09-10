import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import AddCustomerModal from './AddCustomerModal';

const CustomerManagement = () => {
  const { customers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.tabdkNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (customer) => {
    toast({
      title: '🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀'
    });
  };

  const handleDelete = (customer) => {
    toast({
      title: '🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀'
    });
  };

  const handleExport = () => {
    toast({
      title: '🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Müşteri Yönetimi</h2>
          <p className="text-gray-600">Müşterilerinizi yönetin ve yeni müşteri ekleyin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            CSV İndir
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Müşteri Ekle
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Müşteri ara (isim, email, TABDK no)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Müşteriler ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Müşteri</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">İletişim</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">TABDK No</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Kayıt Tarihi</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Durum</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.address}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{customer.email}</p>
                          <p className="text-sm text-gray-600">{customer.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{customer.tabdkNo}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="success">Aktif</Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(customer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(customer)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Sil
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
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Müşteri bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Henüz hiç müşteri eklenmemiş.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Müşteriyi Ekle
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      <AddCustomerModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </div>
  );
};

export default CustomerManagement;