
    import React, { useState, useEffect } from 'react';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
    } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from '@/components/ui/select';
    import { useData } from '@/contexts/DataContext';
    import { toast } from '@/components/ui/use-toast';

    const EditProductModal = ({ open, onOpenChange, product }) => {
      const { categories, updateProduct } = useData();
      const [formData, setFormData] = useState({});
      const [errors, setErrors] = useState({});

      useEffect(() => {
        if (product) {
          setFormData({
            name: product.name || '',
            description: product.description || '',
            category_id: product.category_id || '',
            stock_quantity: product.stock_quantity || 0,
            shelf_price: product.shelf_price || 0,
            selling_price: product.selling_price || 0,
          });
        }
        setErrors({});
      }, [product, open]);

      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
      };

      const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, category_id: value }));
      };

      const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Ürün adı zorunludur.";
        if (formData.stock_quantity < 0) newErrors.stock_quantity = "Stok negatif olamaz.";
        if (formData.shelf_price <= 0) newErrors.shelf_price = "Raf fiyatı pozitif olmalıdır.";
        if (formData.selling_price <= 0) newErrors.selling_price = "Satış fiyatı pozitif olmalıdır.";
        if (!formData.category_id) newErrors.category_id = "Kategori seçimi zorunludur.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        const updates = {
            ...formData,
            stock_quantity: parseInt(formData.stock_quantity, 10),
            shelf_price: parseFloat(formData.shelf_price),
            selling_price: parseFloat(formData.selling_price),
        };

        updateProduct(product.id, updates);
        toast({
          title: 'Başarılı!',
          description: `"${product.name}" ürünü başarıyla güncellendi.`,
          variant: 'success',
        });
        onOpenChange(false);
      };

      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ürünü Düzenle</DialogTitle>
              <DialogDescription>
                Ürün bilgilerini güncelleyin. Değişiklikler anında yansıyacaktır.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Ürün Adı *</Label>
                <Input id="name" value={formData.name || ''} onChange={handleChange} className="col-span-3" />
                {errors.name && <p className="col-start-2 col-span-3 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Açıklama</Label>
                <Input id="description" value={formData.description || ''} onChange={handleChange} className="col-span-3" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category_id" className="text-right">Kategori *</Label>
                <Select onValueChange={handleCategoryChange} value={formData.category_id ? String(formData.category_id) : undefined}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {errors.category_id && <p className="col-start-2 col-span-3 text-sm text-red-500">{errors.category_id}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock_quantity" className="text-right">Stok *</Label>
                <Input id="stock_quantity" type="number" value={formData.stock_quantity || 0} onChange={handleChange} className="col-span-3" />
                {errors.stock_quantity && <p className="col-start-2 col-span-3 text-sm text-red-500">{errors.stock_quantity}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shelf_price" className="text-right">Raf Fiyatı (₺) *</Label>
                <Input id="shelf_price" type="number" step="0.01" value={formData.shelf_price || 0} onChange={handleChange} className="col-span-3" />
                {errors.shelf_price && <p className="col-start-2 col-span-3 text-sm text-red-500">{errors.shelf_price}</p>}
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="selling_price" className="text-right">Satış Fiyatı (₺) *</Label>
                <Input id="selling_price" type="number" step="0.01" value={formData.selling_price || 0} onChange={handleChange} className="col-span-3" />
                {errors.selling_price && <p className="col-start-2 col-span-3 text-sm text-red-500">{errors.selling_price}</p>}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  İptal
                </Button>
                <Button type="submit">Değişiklikleri Kaydet</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default EditProductModal;
  