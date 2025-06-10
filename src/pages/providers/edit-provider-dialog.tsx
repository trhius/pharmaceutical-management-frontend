import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { useQueryClient } from '@tanstack/react-query';
import { SupplierRequest, SupplierResponse } from '@/apis/types/supplier';
import { useUpdateSupplier } from '@/apis/hooks/supplier';

interface EditProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: SupplierResponse;
}

export function EditProviderDialog({ open, onOpenChange, provider }: EditProviderDialogProps) {
  const { toast } = useToast();

  const updateProviderMutation = useUpdateSupplier();
  const queryClient = useQueryClient();

  const form = useForm<SupplierRequest>({
    defaultValues: {
      name: provider.name,
      contactPerson: provider.contactPerson,
      phone: provider.phone,
      email: provider.email,
      taxCode: provider.taxCode,
      address: provider.address,
    },
  });

  const onSubmit = (data: SupplierRequest) => {
    updateProviderMutation.mutate(
      { id: provider.id!, data },
      {
        onSuccess: () => {
          toast({
            title: 'Cập nhật nhà cung cấp thành công',
            description: `${data.name} đã được cập nhật thành công.`, // Use name from form data
          });
          queryClient.invalidateQueries({ queryKey: ['suppliers'] });
          form.reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            title: 'Cập nhật nhà cung cấp thất bại',
            description: error.message || 'Đã xảy ra lỗi khi cập nhật nhà cung cấp.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin nhà cung cấp</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết cho nhà cung cấp.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhà cung cấp</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Nguyễn Văn B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: 1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: 0901234567" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="ví dụ: email@example.com" type="email" {...field} />
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
                    <Textarea placeholder="Ví dụ: Số 1, Đường A, Quận B, Thành phố C" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateProviderMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateProviderMutation.isPending}>
                {updateProviderMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật nhà cung cấp'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
