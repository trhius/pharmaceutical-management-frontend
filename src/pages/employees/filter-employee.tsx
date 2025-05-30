import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { EmployeeRole, ListEmployeeRequest } from '@/apis/types';
import { roles } from '@/apis/types/transform';
import { StoreSelect } from '@/components/store-select';

const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Ngừng hoạt động', value: 'INACTIVE' },
  { label: 'Đình chỉ', value: 'SUSPENDED' },
  { label: 'Đang nghỉ phép', value: 'ON_LEAVE' },
];

export function FilterEmployee({ onFilter }: { onFilter?: (values: ListEmployeeRequest) => void }) {
  const form = useForm<ListEmployeeRequest>({
    defaultValues: {
      role: undefined,
      storeId: undefined,
      status: 'all',
    },
  });

  const [roleOpen, setRoleOpen] = React.useState(false);

  function onSubmit(values: ListEmployeeRequest) {
    const apiFilter: ListEmployeeRequest = {
      ...values,
      status: values.status === 'all' ? undefined : values.status,
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
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
