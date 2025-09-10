import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    tabdkNo: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Hata!',
        description: 'Şifreler eşleşmiyor.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.role) {
      toast({
        title: 'Hata!',
        description: 'Lütfen bir rol seçin.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        toast({
          title: 'Başarılı!',
          description: 'Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.',
        });
        navigate('/login');
      } else {
        toast({
          title: 'Hata!',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Hata!',
        description: 'Bir hata oluştu, lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Kayıt Ol - TanePro B2B</title>
        <meta name="description" content="TanePro B2B platformuna kayıt olun" />
        <meta property="og:title" content="Kayıt Ol - TanePro B2B" />
        <meta property="og:description" content="TanePro B2B platformuna kayıt olun" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-blue-600">
                TanePro B2B
              </CardTitle>
              <CardDescription className="text-center">
                Yeni hesap oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">İsim *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rolünüzü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Müşteri</SelectItem>
                      <SelectItem value="supplier">Tedarikçi</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="Adresiniz"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Zaten hesabınız var mı?{' '}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Giriş yapın
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;