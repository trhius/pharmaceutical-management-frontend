import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth-store';
import { Pill, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const loginSchema = z.object({
  email: z.string().email('Vui lòng nhập email hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      queryClient.invalidateQueries({ queryKey: ['accountInfo'] });

      if (success) {
        toast({
          title: 'Chào mừng trở lại!',
          description: 'Bạn đã đăng nhập thành công.',
        });
        navigate('/');
      } else {
        toast({
          variant: 'destructive',
          title: 'Đăng nhập thất bại',
          description: 'Email hoặc mật khẩu không hợp lệ. Vui lòng thử lại.',
        });
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Login error',
        description: 'An error occurred during login. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary text-primary-foreground rounded-full p-3">
            <Pill className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">Quản lý PharmaPlus</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">Đăng nhập vào tài khoản của bạn</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@pharmacy.com" type="email" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Mật khẩu"
                          type={showPassword ? "text" : "password"}
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

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                      </FormControl>
                      <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Ghi nhớ đăng nhập
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng nhập
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

