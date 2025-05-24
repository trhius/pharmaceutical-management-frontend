import * as React from 'react';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns'; // Import format and date utility functions
import { GetProductRequest } from '@/apis/types/product';
import * as z from 'zod';

// Sample users data
const users = [
  { label: 'John Doe', value: 'john' },
  { label: 'Jane Smith', value: 'jane' },
  { label: 'Robert Johnson', value: 'robert' },
  { label: 'Emily Davis', value: 'emily' },
];

const formSchema = z.object({
  createdDateOption: z.enum(['all', 'custom']),
  createdDateCustom: z.date().optional(),
  group: z.string().default(''),
  brand: z.string().default(''),
  status: z.enum(['all', 'active', 'inactive']),
});

type FormValues = z.infer<typeof formSchema>;

interface TableFilterSidebarProps {
  onFilter: (values: GetProductRequest) => void;
}

export function TableFilterSidebar({ onFilter }: TableFilterSidebarProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdDateOption: 'all',
      createdDateCustom: undefined,
      group: '',
      brand: '',
      status: 'all',
    },
  });

  const [groupOpen, setGroupOpen] = React.useState(false);
  const [providerOpen, setProviderOpen] = React.useState(false);

  function onSubmit(values: FormValues) {
    const apiFilter: GetProductRequest = {};

    // if (values.createdDateOption === 'custom' && values.createdDateCustom) {
    //   apiFilter.createdDateFrom = format(startOfDay(values.createdDateCustom), "yyyy-MM-dd'T'HH:mm:ss");
    //   apiFilter.createdDateTo = format(endOfDay(values.createdDateCustom), "yyyy-MM-dd'T'HH:mm:ss");
    // }

    if (values.status !== 'all') {
      apiFilter.isActive = values.status === 'active';
    }

    apiFilter.brand = values.brand;

    onFilter(apiFilter);
  }

  return (
    <div className="w-full max-w-xs space-y-6 rounded-lg border bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Group */}
          <div className="space-y-2">
            <h3 className="font-medium">Nhóm hàng</h3>
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover open={groupOpen} onOpenChange={setGroupOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={groupOpen}
                          className="w-full justify-between"
                        >
                          {field.value ? users.find((user) => user.value === field.value)?.label : 'Chọn nhóm hàng'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder="Tìm nhóm hàng..." />
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user.value}
                                  value={user.value}
                                  onSelect={(currentValue) => {
                                    form.setValue('group', currentValue === field.value ? '' : currentValue);
                                    setGroupOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === user.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {user.label}
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

          {/* Creation Date */}
          <div className="space-y-2">
            <h3 className="font-medium">Ngày tạo</h3>
            <FormField
              control={form.control}
              name="createdDateOption"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="all" id="creation-date-all-time" />
                      <Label htmlFor="creation-date-all-time">Toàn thời gian</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="creation-date-custom-radio" />
                      <div className="flex w-full items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !form.watch('createdDateCustom') && 'text-muted-foreground'
                              )}
                              onClick={() => form.setValue('createdDateOption', 'custom')}
                              disabled={form.watch('createdDateOption') !== 'custom'}
                            >
                              {form.watch('createdDateCustom') ? (
                                <span>{format(form.watch('createdDateCustom')!, 'dd/MM/yyyy')}</span>
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={form.watch('createdDateCustom')}
                              onSelect={(date) => form.setValue('createdDateCustom', date || undefined)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </RadioGroup>
                </FormItem>
              )}
            />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <h3 className="font-medium">Nhà cung cấp</h3>
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover open={providerOpen} onOpenChange={setProviderOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value ? users.find((user) => user.value === field.value)?.label : 'Chọn nhà cung cấp'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder="Tìm nhà cung cấp..." />
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user.value}
                                  value={user.value}
                                  onSelect={(currentValue) => {
                                    form.setValue('brand', currentValue === field.value ? '' : currentValue);
                                    setProviderOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === user.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {user.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <CommandEmpty>No creator found.</CommandEmpty>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

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
                      variant={field.value === 'all' ? 'default' : 'outline'}
                      onClick={() => form.setValue('status', 'all')}
                    >
                      Tất cả
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'active' ? 'default' : 'outline'}
                      onClick={() => form.setValue('status', 'active')}
                    >
                      Đang kinh doanh
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'inactive' ? 'default' : 'outline'}
                      onClick={() => form.setValue('status', 'inactive')}
                    >
                      Ngừng kinh doanh
                    </Button>
                  </div>
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
