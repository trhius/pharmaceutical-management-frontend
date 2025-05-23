import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, ChevronsUpDown, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useAllStores, useUpdateEmployeeDetails } from '@/apis/hooks/employee';
import { roles } from '@/apis/types/transform';
import { EmployeeResponse, UpdateEmployeeRequest } from '@/apis/types/employee';

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeResponse;
  onEmployeeUpdated: () => void;
}

export function EditEmployeeDialog({ open, onOpenChange, employee }: EditEmployeeDialogProps) {
  const [branchOpen, setBranchOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const queryClient = useQueryClient();

  const storeRes = useAllStores();
  const stores = storeRes.data;

  const updateEmployeeMutation = useUpdateEmployeeDetails();

  const form = useForm<UpdateEmployeeRequest>({
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
  async function onSubmit(data: UpdateEmployeeRequest) {
    if (data.joinDate) {
      data.joinDate = format(data.joinDate, "yyyy-MM-dd'T'HH:mm:ss");
    }

    updateEmployeeMutation.mutate(
      { id: employee.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listEmployees'] });
          onOpenChange(false);
        },
        onError: (error) => {
          console.error('Failed to update employee:', error);
          // Optionally show an error message to the user
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Sửa nhân viên</Button>
      </DialogTrigger>
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
                <FormItem>
                  <FormLabel>Mã nhân viên</FormLabel>
                  <FormControl>
                    <Input
                      value={employee.employeeCode}
                      placeholder="Mã nhân viên tự động"
                      className="bg-gray-200 dark:bg-zinc-800 dark:text-gray-400"
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

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
                        <Popover modal={true} open={branchOpen} onOpenChange={setBranchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={branchOpen}
                              className="w-full justify-between"
                            >
                              {field.value ? stores?.find((store) => store.id === field.value)?.name : 'Chọn chi nhánh'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandList>
                                <CommandInput placeholder="Tìm chi nhánh..." />
                                <CommandGroup>
                                  {stores?.map((store) => (
                                    <CommandItem
                                      key={store.id}
                                      keywords={[store.name || '']}
                                      value={store.id?.toString()}
                                      onSelect={(currentValue) => {
                                        const storeId =
                                          currentValue === field.value?.toString() ? undefined : Number(currentValue);
                                        form.setValue('storeId', storeId);
                                        setBranchOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === store.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      {store.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <CommandEmpty>Ko thấy nhóm hàng nào.</CommandEmpty>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thông tin công việc</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày bắt đầu làm việc</FormLabel>
                      <Popover modal={true}>
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
                              {field.value ? format(field.value, 'dd/MM/yyyy') : 'Chọn ngày'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={form.watch('joinDate')} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức danh</FormLabel>
                      <FormControl>
                        <Popover modal={true} open={roleOpen} onOpenChange={setRoleOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={roleOpen}
                              className="w-full justify-between"
                            >
                              {field.value ? roles.find((role) => role.value === field.value)?.label : 'Chọn chức danh'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandList>
                                <CommandInput placeholder="Tìm chức danh..." />
                                <CommandGroup>
                                  {roles.map((role) => (
                                    <CommandItem
                                      key={role.value}
                                      value={role.value}
                                      keywords={[role.label]}
                                      onSelect={(currentValue) => {
                                        form.setValue('role', currentValue === field.value ? undefined : currentValue);
                                        setRoleOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === role.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      {role.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <CommandEmpty>Ko thấy chức danh nào.</CommandEmpty>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
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
                      <Popover modal={true}>
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
                              {field.value ? format(field.value, 'dd/MM/yyyy') : 'Chọn ngày'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Giới tính</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="MALE" id="male" />
                            <Label htmlFor="male">Nam</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="FEMALE" id="female" />
                            <Label htmlFor="female">Nữ</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
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
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
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
              </CardContent>
            </Card>

            <DialogFooter className="mt-4 flex justify-between sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Bỏ qua
              </Button>
              <Button type="submit" disabled={updateEmployeeMutation.isPending}>
                {updateEmployeeMutation.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
