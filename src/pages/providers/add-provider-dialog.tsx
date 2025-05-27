import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { SupplierRequest } from '@/apis/types/supplier';
import { useAddSupplier } from '@/apis/hooks/supplier';

const formSchema = z.object({
  name: z.string().min(2, 'Tên nhà cung cấp phải có ít nhất 2 ký tự.'),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ.').optional(),
  address: z.string().optional(),
  taxCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProviderAdded: () => void;
}

export function AddProviderDialog({ open, onOpenChange, onProviderAdded }: AddProviderDialogProps) {
  const { toast } = useToast();

  const addSupplierMutation = useAddSupplier();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      taxCode: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    addSupplierMutation.mutate(data as SupplierRequest, {
      onSuccess: () => {
        toast({
          title: 'Đã thêm nhà cung cấp',
          description: `${data.name} đã được thêm thành công.`, // Use name from form data
        });
        form.reset();
        onOpenChange(false);
        onProviderAdded();
      },
      onError: (error) => {
        toast({
          title: 'Thêm nhà cung cấp thất bại',
          description: error.message || 'Đã xảy ra lỗi',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm Nhà Cung Cấp Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết cho nhà cung cấp mới.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhà cung cấp</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Công ty Dược phẩm A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      <Input placeholder="email@example.com" type="email" {...field} />
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
                    <Textarea placeholder="Ví dụ: Số 1, Đường X, Quận Y" {...field} rows={3} />
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={addSupplierMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={addSupplierMutation.isPending}>
                {addSupplierMutation.isPending ? 'Đang thêm...' : 'Thêm nhà cung cấp'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
