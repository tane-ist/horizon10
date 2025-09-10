import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: 'Başarılı!',
          description: 'Giriş yapıldı, yönlendiriliyorsunuz...',
        });
        
        // Get user role and redirect accordingly
        const user = JSON.parse(localStorage.getItem('tanepro_user'));
        if (user) {
          switch (user.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'supplier':
              navigate('/supplier');
              break;
            case 'customer':
              navigate('/customer');
              break;
            default:
              navigate('/');
          }
        }
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
        <title>Giriş Yap - TanePro B2B</title>
        <meta name="description" content="TanePro B2B platformuna giriş yapın" />
        <meta property="og:title" content="Giriş Yap - TanePro B2B" />
        <meta property="og:description" content="TanePro B2B platformuna giriş yapın" />
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
                Hesabınıza giriş yapın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Hesabınız yok mu?{' '}
                  <Link to="/register" className="text-blue-600 hover:underline">
                    Kayıt olun
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Demo hesapları:</p>
                <div className="space-y-1 text-xs">
                  <p><strong>Admin:</strong> admin@tanepro.com / admin123</p>
                  <p><strong>Tedarikçi:</strong> supplier@tanepro.com / supplier123</p>
                  <p><strong>Müşteri:</strong> customer@tanepro.com / customer123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;