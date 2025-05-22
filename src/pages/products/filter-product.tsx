import * as React from 'react';
import { Calendar, Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Sample users data
const users = [
  { label: 'John Doe', value: 'john' },
  { label: 'Jane Smith', value: 'jane' },
  { label: 'Robert Johnson', value: 'robert' },
  { label: 'Emily Davis', value: 'emily' },
];

const formSchema = z.object({
  creationDateOption: z.enum(['all', 'custom']),
  creationDateCustom: z.date().optional(),
  group: z.string().default(''),
  provider: z.string().default(''),
  status: z.enum(['all', 'active', 'inactive']),
});

export function TableFilterSidebar() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creationDateOption: 'all',
      group: '',
      provider: '',
      status: 'all',
    },
  });

  const [groupOpen, setGroupOpen] = React.useState(false);
  const [providerOpen, setProviderOpen] = React.useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
              name="creationDateOption"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="all" id="all-time" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between">
                            Toàn thời gian
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('creationDateOption', 'all');
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={cn('mr-2 h-4 w-4', field.value === 'all' ? 'opacity-100' : 'opacity-0')}
                                  />
                                  Toàn thời gian
                                </CommandItem>
                                <CommandItem onSelect={() => {}} className="cursor-pointer">
                                  Last 7 days
                                </CommandItem>
                                <CommandItem onSelect={() => {}} className="cursor-pointer">
                                  Last 30 days
                                </CommandItem>
                                <CommandItem onSelect={() => {}} className="cursor-pointer">
                                  Last 90 days
                                </CommandItem>
                              </CommandGroup>
                              <CommandEmpty>No creator found.</CommandEmpty>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <div className="flex w-full items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !form.watch('creationDateCustom') && 'text-muted-foreground'
                              )}
                              onClick={() => form.setValue('creationDateOption', 'custom')}
                              disabled={form.watch('creationDateOption') !== 'custom'}
                            >
                              {form.watch('creationDateCustom') ? (
                                <span>{form.watch('creationDateCustom')?.toLocaleDateString('vi')}</span>
                              ) : (
                                <span>Tùy chỉnh</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                              mode="single"
                              selected={form.watch('creationDateCustom')}
                              onSelect={(date) => form.setValue('creationDateCustom', date)}
                              initialFocus
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

          {/* Provider */}
          <div className="space-y-2">
            <h3 className="font-medium">Nhà cung cấp</h3>
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover open={providerOpen} onOpenChange={setProviderOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
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
                                    form.setValue('provider', currentValue === field.value ? '' : currentValue);
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
                      Đang hoạt động
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'inactive' ? 'default' : 'outline'}
                      onClick={() => form.setValue('status', 'inactive')}
                    >
                      Ngừng hoạt động
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
