
import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Edit, Package, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import EditProductModal from './EditProductModal';
import Papa from 'papaparse';

const AdminProductManagement = () => {
  const { products, categories, suppliers, addMultipleProducts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // New state for category filter
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fileInputRef = useRef(null);

  const productsWithDetails = useMemo(() => {
    return products.map(product => {
      const category = categories.find(c => c.id === product.category_id);
      const supplier = suppliers.find(s => s.id === product.supplier_id);
      return {
        ...product,
        categoryName: category ? category.name : 'Bilinmiyor',
        supplierName: supplier ? supplier.name : 'Bilinmiyor',
      };
    });
  }, [products, categories, suppliers]);

  const filteredProducts = productsWithDetails.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleExportCSV = () => {
    const csvData = productsWithDetails.map(({ id, created_at, updated_at, ...rest }) => rest);
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "tanepro_products.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Başarılı!", description: "Ürünler CSV olarak indirildi." });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const importedProducts = results.data.map(item => ({
            name: item.name,
            description: item.description,
            stock_quantity: parseInt(item.stock_quantity, 10) || 0,
            shelf_price: parseFloat(item.shelf_price) || 0,
            selling_price: parseFloat(item.selling_price) || 0,
            category_id: categories.find(c => c.name === item.categoryName)?.id || null,
            supplier_id: suppliers.find(s => s.name === item.supplierName)?.id || null,
            images: item.images ? item.images.split(',') : [],
          }));
          
          await addMultipleProducts(importedProducts);
          toast({ title: "Başarılı!", description: `${importedProducts.length} ürün başarıyla eklendi.` });
        } catch (error) {
          console.error("CSV içe aktarma hatası:", error);
          toast({ variant: "destructive", title: "Hata!", description: "Ürünler içe aktarılırken bir hata oluştu." });
        }
      },
      error: (error) => {
        console.error("CSV okuma hatası:", error);
        toast({ variant: "destructive", title: "Hata!", description: "CSV dosyası okunurken bir hata oluştu." });
      }
    });
     event.target.value = null;
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h2>
        <p className="text-gray-600">Platformdaki tüm ürünleri görüntüleyin ve yönetin.</p>
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
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Ürün, tedarikçi veya kategori ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" onClick={handleExportCSV}>
                 <Download className="h-4 w-4 mr-2" />
                 CSV İndir
               </Button>
               <Button onClick={handleImportClick}>
                 <Upload className="h-4 w-4 mr-2" />
                 CSV Yükle
               </Button>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv"
                  onChange={handleImportCSV}
               />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Ürünler ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ürün Adı</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tedarikçi</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Kategori</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Raf Fiyatı</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Satış Fiyatı</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Stok</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">{product.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{product.supplierName}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{product.categoryName}</td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-right">{product.shelf_price} ₺</td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-right">{product.selling_price} ₺</td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-right">{product.stock_quantity}</td>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory ? 'Arama/filtreleme kriterlerinize uygun ürün bulunamadı.' : 'Platformda henüz hiç ürün yok.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedProduct && (
        <EditProductModal 
          open={showModal} 
          onOpenChange={setShowModal}
          product={selectedProduct}
        />
      )}

    </div>
  );
};

export default AdminProductManagement;
