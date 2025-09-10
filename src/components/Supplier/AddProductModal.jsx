
    import React, { useState, useRef } from 'react';
    import { motion } from 'framer-motion';
    import { X, Upload, Link } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useData } from '@/contexts/DataContext';
    import { useAuth } from '@/contexts/AuthContext';
    import { toast } from '@/components/ui/use-toast';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

    const AddProductModal = ({ open, onOpenChange }) => {
      const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        stock_quantity: '',
        shelf_price: '',
        selling_price: '',
        images: []
      });
      const [loading, setLoading] = useState(false);
      const [imagePreviews, setImagePreviews] = useState([]);
      const [imageUrl, setImageUrl] = useState('');
      const { addProduct, uploadImage, categories } = useData();
      const { user } = useAuth();
      const fileInputRef = useRef(null);

      const handleChange = (field, value) => {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      };

      const handleImageSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setLoading(true);
        const previews = [];
        const uploadedUrls = [];

        for (const file of files) {
          previews.push(URL.createObjectURL(file));

          const newImageUrl = await uploadImage(file);
          if (newImageUrl) {
            uploadedUrls.push(newImageUrl);
          } else {
            toast({
              title: 'Hata!',
              description: `${file.name} yüklenemedi.`,
              variant: 'destructive',
            });
          }
        }

        setImagePreviews(prev => [...prev, ...previews]);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        setLoading(false);
      };

      const handleAddImageUrl = () => {
        if (!imageUrl || !imageUrl.startsWith('http')) {
          toast({
            title: 'Geçersiz URL',
            description: 'Lütfen geçerli bir görsel URL\'si girin.',
            variant: 'destructive',
          });
          return;
        }
        
        setImagePreviews(prev => [...prev, imageUrl]);
        setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
        setImageUrl('');
        toast({
          title: 'Başarılı!',
          description: 'Görsel URL\'si başarıyla eklendi.',
        });
      };

      const triggerFileSelect = () => {
        fileInputRef.current?.click();
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
          const productData = {
            name: formData.name,
            category_id: formData.category_id,
            stock_quantity: parseInt(formData.stock_quantity),
            shelf_price: parseFloat(formData.shelf_price),
            selling_price: parseFloat(formData.selling_price),
            images: formData.images,
            supplier_id: user?.id,
          };

          await addProduct(productData);
          toast({
            title: 'Başarılı!',
            description: 'Ürün başarıyla eklendi.',
          });
          
          setFormData({
            name: '',
            category_id: '',
            stock_quantity: '',
            shelf_price: '',
            selling_price: '',
            images: []
          });
          setImagePreviews([]);
          
          onOpenChange(false);
        } catch (error) {
          toast({
            title: 'Hata!',
            description: 'Ürün eklenirken bir hata oluştu.',
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
              <h2 className="text-xl font-semibold text-gray-900">Yeni Ürün Ekle</h2>
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
                <Label htmlFor="category">Kategori *</Label>
                <Select value={formData.category_id} onValueChange={(value) => handleChange('category_id', value)}>
                  <SelectTrigger>
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
                <Label htmlFor="name">Ürün Adı *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ürün adını girin"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stok Miktarı *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  placeholder="0"
                  value={formData.stock_quantity}
                  onChange={(e) => handleChange('stock_quantity', e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shelf_price">Raf Fiyatı *</Label>
                <Input
                  id="shelf_price"
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
                <Label htmlFor="selling_price">Satış Fiyatı *</Label>
                <Input
                  id="selling_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.selling_price}
                  onChange={(e) => handleChange('selling_price', e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Ürün Görselleri</Label>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="aspect-square relative">
                        <img alt={`Ürün önizlemesi ${index + 1}`} className="w-full h-full object-cover rounded-md" src={src} />
                      </div>
                    ))}
                  </div>
                )}
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Görsel Yükle
                    </TabsTrigger>
                    <TabsTrigger value="url">
                      <Link className="h-4 w-4 mr-2" />
                      URL ile Ekle
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-600 transition mt-2"
                      onClick={triggerFileSelect}
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Görsel yüklemek için tıklayın veya sürükleyip bırakın</p>
                      <Button type="button" variant="outline" onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}>
                        Görsel Seç
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="url">
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddImageUrl}>Ekle</Button>
                    </div>
                  </TabsContent>
                </Tabs>
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
                  {loading ? 'Yükleniyor...' : 'Ürün Ekle'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      );
    };

    export default AddProductModal;
  