import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useChangePassword } from '@/apis/hooks/auth';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại không được để trống.'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onCancel?: () => void; // Optional cancel for regular use, but not for first time login
  isFirstTimeLogin?: boolean; // New prop to indicate first-time login
}

export function ChangePasswordForm({ onSuccess, onCancel, isFirstTimeLogin }: ChangePasswordFormProps) {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const changePasswordMutation = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      toast({
        title: 'Đổi mật khẩu thành công',
        description: 'Mật khẩu của bạn đã được thay đổi.',
      });
      onSuccess();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.',
      });
    }
  }

  const isLoading = changePasswordMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Mật khẩu hiện tại"
                    type={showCurrentPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">Hiện/ẩn mật khẩu hiện tại</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Mật khẩu mới"
                    type={showNewPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">Hiện/ẩn mật khẩu mới</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Xác nhận mật khẩu mới"
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                    disabled={isLoading}
                  >
                    {showConfirmNewPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">Hiện/ẩn mật khẩu xác nhận</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-4">
          {!isFirstTimeLogin && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Hủy
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đổi mật khẩu
          </Button>
        </div>
      </form>
    </Form>
  );
}
