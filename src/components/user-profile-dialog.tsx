import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAccountInfo, useUpdateAccountInfo } from '@/apis/hooks/account';
import { UpdateEmployeeRequest } from '@/apis/types';
import { genders } from '@/apis/types/transform';
import { useQueryClient } from '@tanstack/react-query';

interface UserProfileDialogProps {
  onClose: () => void;
}

export function UserProfileDialog({ onClose }: UserProfileDialogProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { data: accountInfo, isLoading: isAccountInfoLoading } = useAccountInfo();
  const updateAccountMutation = useUpdateAccountInfo();

  const form = useForm<UpdateEmployeeRequest>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      gender: undefined,
      dateOfBirth: undefined,
    },
  });

  useEffect(() => {
    if (accountInfo) {
      form.reset({
        fullName: accountInfo.fullName || '',
        email: accountInfo.email || '',
        phone: accountInfo.phone || '',
        address: accountInfo.address || '',
        gender: accountInfo.gender,
        dateOfBirth: accountInfo.dateOfBirth || undefined,
      });
    }
  }, [accountInfo, form]);

  async function onSubmit(values: UpdateEmployeeRequest) {
    try {
      await updateAccountMutation.mutateAsync({
        ...values,
        dateOfBirth: values.dateOfBirth ? format(values.dateOfBirth, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['accountInfo'] });

      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin cá nhân của bạn đã được cập nhật.',
      });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin cá nhân.',
      });
    }
  }

  const isLoading = isAccountInfoLoading || updateAccountMutation.isPending;

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Thông tin cá nhân</DialogTitle>
        <DialogDescription>Xem và chỉnh sửa thông tin cá nhân của bạn.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Tên của bạn" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" type="email" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Số điện thoại" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Địa chỉ" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày sinh</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          disabled={isLoading}
                        >
                          {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày sinh</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={updateAccountMutation.isPending}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
