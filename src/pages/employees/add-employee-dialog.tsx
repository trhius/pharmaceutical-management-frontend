import * as React from 'react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

import { CreateEmployeeRequest } from '@/apis/types/employee';
import { useCreateEmployee } from '@/apis/hooks/employee';
import { AddBranchDialog } from './add-branch-dialog';
import { StoreSelect } from '@/components/store-select';
import { roles, genders } from '@/apis/types/transform';



const formSchema = z.object({
  fullName: z.string().min(2, 'Tên đầy đủ phải có ít nhất 2 ký tự.'),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ.'),
  phone: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'STORE_MANAGER', 'PHARMACIST', 'INVENTORY_STAFF'], {
    required_error: 'Vui lòng chọn chức danh.',
  }),
  storeId: z.number().optional(),
  dateOfBirth: z.string().optional(), // Assuming date format is string for now
  identityCardNo: z.string().optional(),
  joinDate: z.string().optional(), // Assuming date format is string for now
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded: () => void;
}

export function AddEmployeeDialog({ open, onOpenChange, onEmployeeAdded }: AddEmployeeDialogProps) {
  const { toast } = useToast();

  const createEmployeeMutation = useCreateEmployee();

  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: undefined,
      storeId: undefined,
      dateOfBirth: undefined,
      identityCardNo: '',
      joinDate: undefined,
      gender: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    if (data.joinDate) {
      data.joinDate = format(data.joinDate, "yyyy-MM-dd'T'HH:mm:ss");
    }

    createEmployeeMutation.mutate(data as CreateEmployeeRequest, {
      onSuccess: () => {
        toast({
          title: 'Đã thêm nhân viên',
          description: `${data.fullName} đã được thêm thành công.`, // Use fullName from form data
        });
        form.reset();
        onOpenChange(false);
        onEmployeeAdded();
      },
      onError: (error) => {
        toast({
          title: 'Thêm nhân viên thất bại',
          description: error.message || 'Đã xảy ra lỗi',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm Nhân Viên Mới</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết cho nhân viên mới.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Nguyễn Văn A" {...field} />
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
                    <Input placeholder="john.smith@example.com" type="email" {...field} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chức danh</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chức danh" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <div className="grow-1">
                  <FormLabel>Chi nhánh</FormLabel>
                  <StoreSelect name="storeId" />
                </div>
                <Button
                  type="button"
                  className="mt-auto mb-2"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAddBranchDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="identityCardNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số CMND/CCCD</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày sinh</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'PPP') : <span>Chọn ngày</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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

              {/* Join Date */}
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu làm việc</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'PPP') : <span>Chọn ngày</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createEmployeeMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createEmployeeMutation.isPending}>
                {createEmployeeMutation.isPending ? 'Đang thêm...' : 'Thêm Nhân Viên'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {isAddBranchDialogOpen && <AddBranchDialog open={true} onOpenChange={setIsAddBranchDialogOpen} />}
    </Dialog>
  );
}
