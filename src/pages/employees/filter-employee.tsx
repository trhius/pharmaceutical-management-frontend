import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { ListEmployeeRequest } from '@/apis/types';
import { useAllStores } from '@/apis';
import { roles } from '@/apis/types/transform';


export function FilterEmployee({ onFilter }: { onFilter?: (values: ListEmployeeRequest) => void }) {
  const storeRes = useAllStores();
  const stores = storeRes.data;

  const form = useForm<ListEmployeeRequest>({
    defaultValues: {
      role: undefined,
      storeId: undefined,
      status: 'ACTIVE',
    },
  });

  const [branchOpen, setBranchOpen] = React.useState(false);
  const [roleOpen, setRoleOpen] = React.useState(false);

  function onSubmit(values: ListEmployeeRequest) {
    console.log(values);
    if (onFilter) onFilter(values);
  }

  return (
    <div className="w-full max-w-xs space-y-6 rounded-lg border bg-background p-4">
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
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={field.value === 'ACTIVE' ? 'default' : 'outline'}
                      onClick={() => form.setValue('status', 'ACTIVE')}
                    >
                      Đang hoạt động
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'INACTIVE' ? 'default' : 'outline'}
                      onClick={() => form.setValue('status', 'INACTIVE')}
                    >
                      Ngừng hoạt động
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'SUSPENDED' ? 'default' : 'outline'}
                      onClick={() => form.setValue('status', 'SUSPENDED')}
                    >
                      Đình chỉ
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'ON_LEAVE' ? 'default' : 'outline'}
                      onClick={() => form.setValue('status', 'ON_LEAVE')}
                    >
                      Đang nghỉ phép
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Store */}
          <div className="space-y-2">
            <h3 className="font-medium">Chi nhánh</h3>
            <FormField
              control={form.control}
              name="storeId"
              render={({ field }) => (
                <FormItem>
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
                                    const storeId = currentValue === field.value?.toString() ? undefined : Number(currentValue);
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
                                      currentValue === field.value ? undefined : currentValue
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
