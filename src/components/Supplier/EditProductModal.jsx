
    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { X } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useData } from '@/contexts/DataContext';
    import { toast } from '@/components/ui/use-toast';

    const EditProductModal = ({ product, open, onOpenChange }) => {
      const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        stock_quantity: '',
        shelf_price: '',
        selling_price: '',
      });
      const [loading, setLoading] = useState(false);
      const { categories, updateProduct } = useData();

      useEffect(() => {
        if (product) {
          setFormData({
            name: product.name || '',
            category_id: product.category_id?.toString() || '',
            stock_quantity: product.stock_quantity?.toString() || '',
            shelf_price: product.shelf_price?.toString() || '',
            selling_price: product.selling_price?.toString() || '',
          });
        }
      }, [product]);

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
          const productUpdates = {
            name: formData.name,
            category_id: parseInt(formData.category_id),
            stock_quantity: parseInt(formData.stock_quantity),
            shelf_price: parseFloat(formData.shelf_price),
            selling_price: parseFloat(formData.selling_price),
          };

          await updateProduct(product.id, productUpdates);
          toast({
            title: 'Başarılı!',
            description: 'Ürün başarıyla güncellendi.',
          });
          
          onOpenChange(false);
        } catch (error) {
          toast({
            title: 'Hata!',
            description: 'Ürün güncellenirken bir hata oluştu.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      if (!open || !product) return null;

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
              <h2 className="text-xl font-semibold text-gray-900">Ürünü Düzenle</h2>
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
                <Label htmlFor="edit-category">Kategori *</Label>
                <Select value={formData.category_id} onValueChange={(value) => handleChange('category_id', value)}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Ürün Adı *</Label>
                <Input
                  id="edit-name"
                  type="text"
                  placeholder="Ürün adını girin"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-stock_quantity">Stok Miktarı *</Label>
                <Input
                  id="edit-stock_quantity"
                  type="number"
                  placeholder="0"
                  value={formData.stock_quantity}
                  onChange={(e) => handleChange('stock_quantity', e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-shelf_price">Raf Fiyatı *</Label>
                <Input
                  id="edit-shelf_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.shelf_price}
                  onChange={(e) => handleChange('shelf_price', e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-selling_price">Satış Fiyatı *</Label>
                <Input
                  id="edit-selling_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.selling_price}
                  onChange={(e) => handleChange('selling_price', e.target.value)}
                  required
                  min="0"
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
                  {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      );
    };

    export default EditProductModal;
  