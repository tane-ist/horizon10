
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Plus, Search, MoreHorizontal, Edit, Trash2, LayoutList } from 'lucide-react';
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
    import AddEditCategoryModal from './AddEditCategoryModal';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog";


    const CategoryManagement = () => {
      const { categories, deleteCategory } = useData();
      const [searchTerm, setSearchTerm] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
      const [categoryToDelete, setCategoryToDelete] = useState(null);

      const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const handleAdd = () => {
        setSelectedCategory(null);
        setShowModal(true);
      };

      const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowModal(true);
      };

      const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteConfirm(true);
      };

      const handleDelete = () => {
        if (categoryToDelete) {
          deleteCategory(categoryToDelete.id);
          toast({
            title: 'Başarılı!',
            description: `"${categoryToDelete.name}" kategorisi silindi.`,
            variant: 'success',
          });
          setShowDeleteConfirm(false);
          setCategoryToDelete(null);
        }
      };

      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h2>
              <p className="text-gray-600">Ürün kategorilerinizi yönetin.</p>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Kategori Ekle
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kategoriler ({filteredCategories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCategories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Kategori Adı</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Açıklama</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((category, index) => (
                        <motion.tr
                          key={category.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 font-medium text-gray-900">{category.name}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{category.description || '-'}</td>
                          <td className="py-4 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(category)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => confirmDelete(category)}
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
                    <LayoutList className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Kategori bulunamadı</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Arama kriterlerinize uygun kategori bulunamadı.' : 'Henüz hiç kategori eklenmemiş.'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      İlk Kategoriyi Ekle
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <AddEditCategoryModal 
            open={showModal} 
            onOpenChange={setShowModal}
            category={selectedCategory}
          />

          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kategoriyi Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. "{categoryToDelete?.name}" kategorisini kalıcı olarak silecektir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Sil</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      );
    };

    export default CategoryManagement;
  