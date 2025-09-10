
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Plus, Search, Grid, List, MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';
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
    import { useAuth } from '@/contexts/AuthContext';
    import { toast } from '@/components/ui/use-toast';
    import AddProductModal from './AddProductModal';
    import EditProductModal from './EditProductModal';

    const ProductManagement = () => {
      const { products, categories, deleteProduct } = useData();
      const { user } = useAuth();
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [showAddModal, setShowAddModal] = useState(false);
      const [showEditModal, setShowEditModal] = useState(false);
      const [selectedProduct, setSelectedProduct] = useState(null);
      const [viewMode, setViewMode] = useState('grid');

      const DEFAULT_PRODUCT_IMAGE = "https://horizons-cdn.hostinger.com/3e4b0b1a-4e98-4f42-9ffe-aa1d2f8deee4/7d67629f16878d6f9dd4d3992d217cbd.jpg";

      const myProducts = products.filter(product => product.supplier_id === user?.id);

      const filteredProducts = myProducts.filter(product => {
        const category = categories.find(cat => cat.id === product.category_id);
        const categoryName = category ? category.name : '';
        
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              categoryName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
        
        return matchesSearch && matchesCategory;
      });

      const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
      };

      const handleDelete = (product) => {
        // Here you would typically show a confirmation dialog first
        try {
          deleteProduct(product.id);
          toast({
            title: 'Başarılı!',
            description: `${product.name} başarıyla silindi.`
          });
        } catch (error) {
          toast({
            title: 'Hata!',
            description: 'Ürün silinirken bir hata oluştu.',
            variant: 'destructive',
          });
        }
      };

      const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id.toString() === categoryId.toString());
        return category ? category.name : 'Bilinmeyen Kategori';
      };

      const ProductCard = ({ product, index }) => {
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : DEFAULT_PRODUCT_IMAGE;
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <img 
                    src={imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_PRODUCT_IMAGE; }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                  <Badge variant="outline">{getCategoryName(product.category_id)}</Badge>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Stok: {product.stock_quantity}</p>
                      <p className="font-semibold text-green-600">₺{product.selling_price}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(product)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      }

      const ProductRow = ({ product, index }) => {
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : DEFAULT_PRODUCT_IMAGE;

        return (
          <motion.tr
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border-b border-gray-100 hover:bg-gray-50"
          >
            <td className="py-4 px-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src={imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { e.target.onerror = null; e.target.src=DEFAULT_PRODUCT_IMAGE; }}
                    />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <Badge variant="outline" className="mt-1">{getCategoryName(product.category_id)}</Badge>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <span className="text-gray-900">{product.stock_quantity}</span>
            </td>
            <td className="py-4 px-4">
              <span className="text-gray-600">₺{product.shelf_price}</span>
            </td>
            <td className="py-4 px-4">
              <span className="font-medium text-green-600">₺{product.selling_price}</span>
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
                  <DropdownMenuItem onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Düzenle
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(product)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </motion.tr>
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h2>
              <p className="text-gray-600">Ürünlerinizi yönetin ve yeni ürün ekleyin</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ürün Ekle
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(null)}
                  className="whitespace-nowrap"
                >
                  Tüm Kategoriler
                </Button>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Ürün veya kategori ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ürünlerim ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Ürün</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Stok</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Raf Fiyatı</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Satış Fiyatı</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Durum</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-900">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product, index) => (
                          <ProductRow key={product.id} product={product} index={index} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory ? 'Arama/filtreleme kriterlerinize uygun ürün bulunamadı.' : 'Henüz hiç ürün eklenmemiş.'}
                  </p>
                  {!searchTerm && !selectedCategory && (
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      İlk Ürünü Ekle
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <AddProductModal 
            open={showAddModal} 
            onOpenChange={setShowAddModal}
          />
          
          {selectedProduct && (
            <EditProductModal
              product={selectedProduct}
              open={showEditModal}
              onOpenChange={setShowEditModal}
            />
          )}
        </div>
      );
    };

    export default ProductManagement;
  