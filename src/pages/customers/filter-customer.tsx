import * as React from 'react';
import { Calendar, Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
  creator: z.string().default(''),
  gender: z.enum(['all', 'male', 'female']),
  birthdayOption: z.enum(['all', 'custom']),
  birthdayCustom: z.date().optional(),
  lastTransactionOption: z.enum(['all', 'custom']),
  lastTransactionCustom: z.date().optional(),
  totalSalesFrom: z.string().default(''),
  totalSalesTo: z.string().default(''),
  status: z.enum(['all', 'active', 'inactive']),
});

export function TableFilterSidebar() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creationDateOption: 'all',
      gender: 'all',
      birthdayOption: 'all',
      lastTransactionOption: 'all',
      status: 'all',
      totalSalesFrom: '',
      totalSalesTo: '',
      creator: '',
    },
  });

  const [open, setOpen] = React.useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="w-full max-w-xs space-y-6 rounded-lg border bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Creator */}
          <div className="space-y-2">
            <h3 className="font-medium">Người tạo</h3>
            <FormField
              control={form.control}
              name="creator"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {field.value ? users.find((user) => user.value === field.value)?.label : 'Chọn người tạo'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder="Search creator..." />
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user.value}
                                  value={user.value}
                                  onSelect={(currentValue) => {
                                    form.setValue('creator', currentValue === field.value ? '' : currentValue);
                                    setOpen(false);
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

          {/* Gender */}
          <div className="space-y-2">
            <h3 className="font-medium">Giới tính</h3>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={field.value === 'all' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => form.setValue('gender', 'all')}
                    >
                      Tất cả
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'male' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => form.setValue('gender', 'male')}
                    >
                      Nam
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'female' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => form.setValue('gender', 'female')}
                    >
                      Nữ
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <h3 className="font-medium">Sinh nhật</h3>
            <FormField
              control={form.control}
              name="birthdayOption"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="all" id="birthday-all-time" />
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
                                    form.setValue('birthdayOption', 'all');
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={cn('mr-2 h-4 w-4', field.value === 'all' ? 'opacity-100' : 'opacity-0')}
                                  />
                                  Toàn thời gian
                                </CommandItem>
                                <CommandItem onSelect={() => {}} className="cursor-pointer">
                                  This month
                                </CommandItem>
                                <CommandItem onSelect={() => {}} className="cursor-pointer">
                                  Next month
                                </CommandItem>
                              </CommandGroup>
                              <CommandEmpty>No creator found.</CommandEmpty>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="birthday-custom" />
                      <div className="flex w-full items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !form.watch('birthdayCustom') && 'text-muted-foreground'
                              )}
                              onClick={() => form.setValue('birthdayOption', 'custom')}
                              disabled={form.watch('birthdayOption') !== 'custom'}
                            >
                              {form.watch('birthdayCustom') ? (
                                <span>{form.watch('birthdayCustom')?.toLocaleDateString()}</span>
                              ) : (
                                <span>Tùy chỉnh</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                              mode="single"
                              selected={form.watch('birthdayCustom')}
                              onSelect={(date) => form.setValue('birthdayCustom', date)}
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

          {/* Last Transaction Date */}
          <div className="space-y-2">
            <h3 className="font-medium">Ngày giao dịch cuối</h3>
            <FormField
              control={form.control}
              name="lastTransactionOption"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="all" id="last-transaction-all-time" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            disabled={form.watch('lastTransactionOption') !== 'all'}
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
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
                                    form.setValue('lastTransactionOption', 'all');
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={cn('mr-2 h-4 w-4', field.value === 'all' ? 'opacity-100' : 'opacity-0')}
                                  />
                                  All time
                                </CommandItem>
                                <CommandItem onSelect={() => {}} className="cursor-pointer">
                                  Last 7 days
                                </CommandItem>
                                <CommandItem onSelect={() => {}} className="cursor-pointer">
                                  Last 30 days
                                </CommandItem>
                              </CommandGroup>
                              <CommandEmpty>No creator found.</CommandEmpty>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="last-transaction-custom" />
                      <div className="flex w-full items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !form.watch('lastTransactionCustom') && 'text-muted-foreground'
                              )}
                              onClick={() => form.setValue('lastTransactionOption', 'custom')}
                              disabled={form.watch('lastTransactionOption') !== 'custom'}
                            >
                              {form.watch('lastTransactionCustom') ? (
                                <span>{form.watch('lastTransactionCustom')?.toLocaleDateString('vi')}</span>
                              ) : (
                                <span>Tùy chỉnh</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                              mode="single"
                              selected={form.watch('lastTransactionCustom')}
                              onSelect={(date) => form.setValue('lastTransactionCustom', date)}
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

          {/* Total Sales */}
          <div className="space-y-2">
            <h3 className="font-medium">Tổng bán</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-12 shrink-0 text-sm">Từ</div>
                <FormField
                  control={form.control}
                  name="totalSalesFrom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter value" type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 shrink-0 text-sm">Đến</div>
                <FormField
                  control={form.control}
                  name="totalSalesTo"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter value" type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
