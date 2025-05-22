import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query'
import { CalendarIcon, Search, ChevronsUpDown, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { employee as employeeApi, useAllStores } from '@/apis';

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeResponse;
}

export function EditEmployeeDialog({ open, onOpenChange, employee }: EditEmployeeDialogProps) {
  const [areaOpen, setAreaOpen] = useState(false);
  const [wardOpen, setWardOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const queryClient = useQueryClient()

  const storeRes = useAllStores();
  const stores = storeRes.data;

  // Initialize the form
  const form = useForm({
    defaultValues: {
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      phone: employee.phone,
      branch: employee.branch,
      notes: employee.notes,
      dateOfBirth: employee.dateOfBirth,
      identityCard: employee.identityCard,
      gender: employee.gender,
      address: employee.address,
      area: employee.area,
      ward: employee.ward,
      facebook: employee.facebook,
      email: employee.email,
    },
  });

  useEffect(() => {
    form.reset({
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      phone: employee.phone,
      branch: employee.branch,
      notes: employee.notes,
      identityCard: employee.identityCard,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      address: employee.address,
      area: employee.area,
      ward: employee.ward,
      facebook: employee.facebook,
      email: employee.email,
    });
  }, [employee, form]);

  // Form submission handler
  async function onSubmit(data: FormValues) {
    onOpenChange(false);
    await employeeApi.updateEmployeeDetails(employee.id, data);
    queryClient.invalidateQueries({ queryKey: ['listEmployees'] });
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
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã nhân viên</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Mã nhân viên tự động"
                          className="bg-gray-200 dark:bg-zinc-800 dark:text-gray-400"
                          readOnly
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
                        <Popover open={branchOpen} onOpenChange={setBranchOpen}>
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày bắt đầu làm việc</FormLabel>
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
                  name="position"
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
                          <SelectItem value="manager">Quản lý</SelectItem>
                          <SelectItem value="employee">Nhân viên</SelectItem>
                          <SelectItem value="accountant">Kế toán</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
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
                  name="identityCard"
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
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khu vực</FormLabel>
                      <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={areaOpen}
                              className="w-full justify-between"
                            >
                              {field.value || 'Chọn Tỉnh/TP - Quận/Huyện'}
                              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Tìm kiếm..." />
                            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('area', 'Hà Nội - Ba Đình');
                                    setAreaOpen(false);
                                  }}
                                >
                                  Hà Nội - Ba Đình
                                </CommandItem>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('area', 'Hà Nội - Cầu Giấy');
                                    setAreaOpen(false);
                                  }}
                                >
                                  Hà Nội - Cầu Giấy
                                </CommandItem>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('area', 'TP.HCM - Quận 1');
                                    setAreaOpen(false);
                                  }}
                                >
                                  TP.HCM - Quận 1
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phường/Xã</FormLabel>
                      <Popover open={wardOpen} onOpenChange={setWardOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={wardOpen}
                              className="w-full justify-between"
                            >
                              {field.value || 'Chọn Phường/Xã'}
                              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Tìm kiếm..." />
                            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('ward', 'Phường Trúc Bạch');
                                    setWardOpen(false);
                                  }}
                                >
                                  Phường Trúc Bạch
                                </CommandItem>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('ward', 'Phường Vĩnh Phúc');
                                    setWardOpen(false);
                                  }}
                                >
                                  Phường Vĩnh Phúc
                                </CommandItem>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('ward', 'Phường Cống Vị');
                                    setWardOpen(false);
                                  }}
                                >
                                  Phường Cống Vị
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
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
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

