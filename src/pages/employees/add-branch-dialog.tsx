import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { CreateStoreRequest } from '@/apis/types/employee';
import { useCreateStore } from '@/apis/hooks/employee';

const formSchema = z.object({
  name: z.string().min(2, 'Tên chi nhánh phải có ít nhất 2 ký tự.'),
  address: z.string().min(5, 'Địa chỉ chi nhánh phải có ít nhất 5 ký tự.'),
  phone: z.string().optional(),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ.').optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoreAdded?: () => void;
}

export function AddBranchDialog({ open, onOpenChange, onStoreAdded }: AddBranchDialogProps) {
  const { toast } = useToast();

  const createStoreMutation = useCreateStore();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    createStoreMutation.mutate(data as CreateStoreRequest, {
      onSuccess: () => {
        toast({
          title: 'Đã thêm Chi Nhánh',
          description: `${data.name} đã được thêm thành công.`, // Use name from form data
        });
        form.reset();
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ['allStores'] });
        if (onStoreAdded) onStoreAdded();
      },
      onError: (error) => {
        toast({
          title: 'Thêm chi nhánh thất bại',
          description: error.message || 'Đã xảy ra lỗi',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm chi nhánh Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết cho chi nhánh mới.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chi nhánh</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: chi nhánh A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Số 1, Đường ABC" {...field} />
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
                    <Input placeholder="Ví dụ: 0901234567" {...field} />
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
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={createStoreMutation.isPending}>
                {createStoreMutation.isPending ? 'Đang thêm...' : 'Thêm chi nhánh'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
