import { EmployeeRole, EmployeeStatus, ListEmployeeRequest } from '@/apis/types';
import * as z from 'zod';
import { roles } from '@/apis/types/transform';
import { StoreSelect } from '@/components/store-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { CommandList, CommandInput, CommandGroup, CommandItem, CommandEmpty } from 'cmdk';
import { ChevronsUpDown, Command, Check } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Ngừng hoạt động', value: 'INACTIVE' },
  { label: 'Đình chỉ', value: 'SUSPENDED' },
  { label: 'Đang nghỉ phép', value: 'ON_LEAVE' },
];

const statuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'ON_LEAVE'];

const formSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'STORE_MANAGER', 'PHARMACIST', 'INVENTORY_STAFF']).optional().nullable(),
  storeId: z.number().optional().nullable(),
  status: z.enum(['all', ...statuses]).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export function FilterEmployee({ onFilter }: { onFilter?: (values: ListEmployeeRequest) => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: null,
      storeId: null,
      status: 'all',
    },
  });

  const [roleOpen, setRoleOpen] = React.useState(false);

  function onSubmit(values: FormValues) {
    const apiFilter: ListEmployeeRequest = {
      role: values.role === null ? undefined : values.role,
      storeId: values.storeId === null ? undefined : values.storeId,
      status: values.status === 'all' ? undefined : values.status as EmployeeStatus,
    };
    console.log(apiFilter);
    if (onFilter) onFilter(apiFilter);
  }

  return (
    <div className="w-full min-w-xs space-y-6 rounded-lg border bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <h3 className="font-medium">Trạng thái</h3>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.slice(0).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Store */}
          <div className="space-y-2">
            <h3 className="font-medium">Chi nhánh</h3>
            <StoreSelect name="storeId" />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <h3 className="font-medium">Chức danh</h3>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover open={roleOpen} onOpenChange={setRoleOpen}>
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
                                    form.setValue(
                                      'role',
                                      currentValue === field.value ? undefined : (currentValue as EmployeeRole)
                                    );
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
          </div>

          <Button type="submit" className="w-full">
            Áp dụng bộ lọc
          </Button>
        </form>
      </Form>
    </div>
  );
}
