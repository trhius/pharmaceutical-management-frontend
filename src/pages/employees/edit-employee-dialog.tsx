import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { EmployeeResponse, UpdateEmployeeRequest, StoreResponse } from '@/apis/types/employee';
import { useAllStores, useUpdateEmployeeDetails } from '@/apis/hooks/employee';
import { useToast } from '@/hooks/use-toast';

const roles = [
  { label: 'Quản trị viên', value: 'SUPER_ADMIN' },
  { label: 'Quản lý cửa hàng', value: 'STORE_MANAGER' },
  { label: 'Dược sĩ', value: 'PHARMACIST' },
  { label: 'Nhân viên hàng hóa', value: 'INVENTORY_STAFF' },
];

const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
];

const formSchema = z.object({
  fullName: z.string().min(2, 'Tên đầy đủ phải có ít nhất 2 ký tự.').optional(),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ.').optional(),
  phone: z.string().optional(),
  storeId: z.number().optional(),
  role: z.enum(['SUPER_ADMIN', 'STORE_MANAGER', 'PHARMACIST', 'INVENTORY_STAFF']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'ON_LEAVE']).optional(),
  dateOfBirth: z.string().optional(), // Assuming date format is string
  identityCardNo: z.string().optional(),
  joinDate: z.string().optional(), // Assuming date format is string
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeResponse;
  onEmployeeUpdated: () => void;
}

export function EditEmployeeDialog({ open, onOpenChange, employee, onEmployeeUpdated }: EditEmployeeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stores, isLoading: isLoadingStores } = useAllStores();
  const updateEmployeeMutation = useUpdateEmployeeDetails();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: employee.fullName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      storeId: employee.storeId || undefined,
      role: employee.role || undefined,
      status: employee.status || 'ACTIVE',
      dateOfBirth: employee.dateOfBirth || undefined,
      identityCardNo: employee.identityCard || '',
      joinDate: employee.joinDate || undefined,
      gender: employee.gender || undefined,
      address: employee.address || '',
    },
  });

  useEffect(() => {
    form.reset({
      fullName: employee.fullName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      storeId: employee.storeId || undefined,
      role: employee.role || undefined,
      status: employee.status || 'ACTIVE',
      dateOfBirth: employee.dateOfBirth || undefined,
      identityCardNo: employee.identityCard || '',
      joinDate: employee.joinDate || undefined,
      gender: employee.gender || undefined,
      address: employee.address || '',
    });
  }, [employee, form]);

  // Form submission handler
  async function onSubmit(data: FormValues) {
    if (employee.id === undefined) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin nhân viên: ID nhân viên không xác định.',
        variant: 'destructive',
      });
      return;
    }

    updateEmployeeMutation.mutate(
      {
        id: employee.id,
        data: data as UpdateEmployeeRequest,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Cập nhật thành công',
            description: `Thông tin nhân viên ${data.fullName || employee.fullName} đã được cập nhật.`, // Use original name if fullName is empty in form
          });
          onOpenChange(false);
          onEmployeeUpdated();
        },
        onError: (error) => {
          toast({
            title: 'Cập nhật thất bại',
            description: error.message || 'Đã xảy ra lỗi khi cập nhật thông tin nhân viên.',
            variant: 'destructive',
          });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sửa thông tin nhân viên</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Initial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin khởi tạo</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã nhân viên</FormLabel>
                      <FormControl>
                        <Input
                          value={employee.employeeCode || ''} // Display employeeCode from prop
                          disabled // employeeCode is not editable
                          placeholder="Mã nhân viên tự động"
                          className="bg-gray-200 dark:bg-zinc-800 dark:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên nhân viên</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} type="email" />
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
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chi nhánh</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                            >
                              {field.value ? stores?.find((store) => store.id === field.value)?.name : 'Chọn chi nhánh'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Tìm chi nhánh..." />
                              <CommandList>
                                <CommandEmpty>Không tìm thấy chi nhánh.</CommandEmpty>
                                <CommandGroup>
                                  {stores?.map((store) => (
                                    <CommandItem
                                      value={store.id?.toString()}
                                      key={store.id}
                                      onSelect={() => {
                                        form.setValue('storeId', store.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          store.id === field.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      {store.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức danh</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                          <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
                          <SelectItem value="SUSPENDED">Đình chỉ</SelectItem>
                          <SelectItem value="ON_LEAVE">Đang nghỉ phép</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="identityCardNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số CMND/CCCD</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                      <Popover>
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
                              {field.value ? format(new Date(field.value), 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((gender) => (
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
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày vào làm</FormLabel>
                      <Popover>
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
                              {field.value ? format(new Date(field.value), 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <DialogFooter className="mt-4 flex justify-between sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateEmployeeMutation.isLoading}
              >
                Bỏ qua
              </Button>
              <Button type="submit" disabled={updateEmployeeMutation.isLoading}>
                {updateEmployeeMutation.isLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
