
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
    import { useData } from '@/contexts/DataContext';
    import { toast } from '@/components/ui/use-toast';

    const AddEditCategoryModal = ({ open, onOpenChange, category }) => {
      const { addCategory, updateCategory } = useData();
      const [name, setName] = useState('');
      const [description, setDescription] = useState('');
      const [error, setError] = useState('');

      const isEditMode = Boolean(category);

      useEffect(() => {
        if (open) {
          if (isEditMode) {
            setName(category.name);
            setDescription(category.description || '');
          } else {
            setName('');
            setDescription('');
          }
          setError('');
        }
      }, [open, category, isEditMode]);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
          setError('Kategori adı zorunludur.');
          return;
        }

        const categoryData = { name, description };

        if (isEditMode) {
          updateCategory(category.id, categoryData);
          toast({
            title: 'Başarılı!',
            description: 'Kategori başarıyla güncellendi.',
            variant: 'success',
          });
        } else {
          addCategory(categoryData);
          toast({
            title: 'Başarılı!',
            description: 'Yeni kategori eklendi.',
            variant: 'success',
          });
        }
        onOpenChange(false);
      };

      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Kategori bilgilerini güncelleyin.' : 'Yeni bir ürün kategorisi oluşturun.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Kategori Adı *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Viski"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kategori hakkında kısa açıklama (isteğe bağlı)"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  İptal
                </Button>
                <Button type="submit">{isEditMode ? 'Kaydet' : 'Ekle'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default AddEditCategoryModal;
  