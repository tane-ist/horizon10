
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Package, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';

const ProductBrowsing = () => {
  const { products, categories, addToCart } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const DEFAULT_PRODUCT_IMAGE = "https://horizons-cdn.hostinger.com/3e4b0b1a-4e98-4f42-9ffe-aa1d2f8deee4/7d67629f16878d6f9dd4d3992d217cbd.jpg";

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || String(product.category_id) === String(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => String(cat.id) === String(categoryId));
    return category ? category.name : categoryId;
  };

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
    toast({
      title: 'Başarılı!',
      description: `${product.name} (${quantity} adet) sepete eklendi.`,
    });
  };

  const ProductCard = ({ product, index }) => {
    const [quantity, setQuantity] = useState(1);
    
    const calculateDiscount = () => {
      if (product.shelf_price && product.selling_price && product.shelf_price > product.selling_price) {
        return Math.round(((product.shelf_price - product.selling_price) / product.shelf_price) * 100);
      }
      return 0;
    };

    const discount = calculateDiscount();

    const handleQuantityChange = (newQuantity) => {
      if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
        setQuantity(newQuantity);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="card-hover h-full">
          <CardContent className="p-4">
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative">
              {discount > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                  %{discount} İndirim
                </Badge>
              )}
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <img  alt={`${product.name} ürün görseli`} className="w-full h-full object-cover rounded-lg" src={DEFAULT_PRODUCT_IMAGE} />
              )}
            </div>
            <div className="space-y-3">
              <Badge variant="outline">{getCategoryName(product.category_id)}</Badge>
              <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
              
              {/* Fiyat Bilgileri */}
              <div className="space-y-1">
                {product.shelf_price && product.shelf_price > product.selling_price && (
                  <p className="text-sm text-gray-500">Raf Fiyatı: ₺{product.shelf_price}</p>
                )}
                <p className="text-lg font-semibold text-blue-600">₺{product.selling_price}</p>
                <p className="text-sm text-gray-600">Stok: {product.stock_quantity}</p>
              </div>

              {/* Adet Seçimi ve Sepete Ekleme */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Adet:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock_quantity}
                      className="w-16 h-8 text-center text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock_quantity}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product, quantity)}
                  disabled={product.stock_quantity === 0}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Sepete Ekle ({quantity} adet)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ürünler</h2>
        <p className="text-gray-600">Tüm ürünleri keşfedin ve sepetinize ekleyin</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Tümü
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={String(selectedCategory) === String(category.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Ürünler ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Arama kriterlerinize uygun ürün bulunamadı.' 
                  : 'Henüz hiç ürün bulunmuyor.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductBrowsing;
