import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, ChevronsUpDown, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useAllStores, useUpdateEmployeeDetails } from '@/apis/hooks/employee';
import { roles, genders } from '@/apis/types/transform';
import { EmployeeResponse, UpdateEmployeeRequest } from '@/apis/types/employee';

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeResponse;
  onEmployeeUpdated: () => void;
}

export function EditEmployeeDialog({ open, onOpenChange, employee }: EditEmployeeDialogProps) {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sửa thông tin nhân viên</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết cho nhân viên.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

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

              {/* Store */}
              <FormField
                control={form.control}
                name="storeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi nhánh</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? stores?.find((store) => store.id === field.value)?.name : 'Chọn chi nhánh'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Nguyễn Văn A" {...field} />
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
                disabled={updateEmployeeMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateEmployeeMutation.isPending}>
                {updateEmployeeMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
