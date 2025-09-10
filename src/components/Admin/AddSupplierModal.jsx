import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';

const AddSupplierModal = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tabdkNo: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const { addSupplier } = useData();

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      addSupplier(formData);
      toast({
        title: 'Başarılı!',
        description: 'Tedarikçi başarıyla eklendi.',
      });
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        tabdkNo: '',
        address: ''
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Hata!',
        description: 'Tedarikçi eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Yeni Tedarikçi Ekle</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tedarikçi Adı *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tedarikçi adını girin"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+90 555 123 4567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tabdkNo">TABDK No *</Label>
            <Input
              id="tabdkNo"
              type="text"
              placeholder="TABDK123"
              value={formData.tabdkNo}
              onChange={(e) => handleChange('tabdkNo', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              type="text"
              placeholder="Adres bilgisi"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ekleniyor...' : 'Tedarikçi Ekle'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddSupplierModal;