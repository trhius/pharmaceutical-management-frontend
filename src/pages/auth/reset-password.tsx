import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Loader2, ArrowLeft, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useResetPassword, useVerifyResetToken } from '@/apis/hooks/auth';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const verifyTokenQuery = useVerifyResetToken(token || '', {
    enabled: !!token,
  });

  const resetPasswordMutation = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (verifyTokenQuery.isError) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Mã đặt lại không hợp lệ hoặc đã hết hạn.',
      });
      navigate('/forgot-password');
    }
  }, [verifyTokenQuery.isError, navigate, toast]);

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true);
    try {
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không tìm thấy mã đặt lại.',
        });
        setIsLoading(false);
        return;
      }
      await resetPasswordMutation.mutateAsync({
        token: token,
        newPassword: data.password,
      });

      toast({
        title: 'Đặt lại mật khẩu thành công',
        description: 'Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập.',
      });
      navigate('/login');
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã xảy ra sự cố khi đặt lại mật khẩu. Vui lòng thử lại.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (verifyTokenQuery.isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <h2 className="mt-6 text-center text-2xl font-extrabold text-foreground">Đang xác minh mã...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary text-primary-foreground rounded-full p-3">
            <Pill className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">Đặt lại mật khẩu của bạn</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">Nhập mật khẩu mới của bạn bên dưới.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Mật khẩu mới"
                          type={showPassword ? 'text' : 'password'}
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeIcon className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span className="sr-only">Hiện/ẩn mật khẩu</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Xác nhận mật khẩu mới"
                          type={showPassword ? 'text' : 'password'}
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeIcon className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span className="sr-only">Hiện/ẩn mật khẩu</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || verifyTokenQuery.isLoading || verifyTokenQuery.isError}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đặt lại mật khẩu
              </Button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80">
                  <ArrowLeft className="inline mr-1 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
