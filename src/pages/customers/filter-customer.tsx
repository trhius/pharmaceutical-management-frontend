import * as React from 'react';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'; // Added FormLabel
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, startOfDay, endOfDay } from 'date-fns'; // Import format and date utility functions
import { cn } from '@/lib/utils';

import { CustomerListRequest } from '@/apis/types/customer';

const genderOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
];

const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Ngừng hoạt động', value: 'INACTIVE' },
  { label: 'Đã vô hiệu hóa', value: 'DEACTIVATED' },
];

const formSchema = z.object({
  createdDateOption: z.enum(['all', 'custom']),
  createdDateCustom: z.date().optional(),
  createBy: z.string().optional(),
  gender: z.enum(['all', 'MALE', 'FEMALE', 'OTHER']),
  birthDateOption: z.enum(['all', 'custom']),
  birthDateCustom: z.date().optional(),
  spentAmountFrom: z.string().optional(),
  spentAmountTo: z.string().optional(),
  status: z.enum(['all', 'ACTIVE', 'INACTIVE', 'DEACTIVATED']),
});

type FormValues = z.infer<typeof formSchema>;

interface TableFilterSidebarProps {
  onFilter: (values: CustomerListRequest) => void;
}

export function TableFilterSidebar({ onFilter }: TableFilterSidebarProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdDateOption: 'all',
      gender: 'all',
      birthDateOption: 'all',
      status: 'all',
      spentAmountFrom: '',
      spentAmountTo: '',
      createBy: '',
      createdDateCustom: undefined,
      birthDateCustom: undefined,
    },
  });

  function onSubmit(values: FormValues) {
    const apiFilter: CustomerListRequest = {};

    if (values.createdDateOption === 'custom' && values.createdDateCustom) {
      apiFilter.createdDateFrom = format(startOfDay(values.createdDateCustom), "yyyy-MM-dd'T'HH:mm:ss");
      apiFilter.createdDateTo = format(endOfDay(values.createdDateCustom), "yyyy-MM-dd'T'HH:mm:ss");
    }

    if (values.createBy) {
      apiFilter.createBy = values.createBy;
    }

    if (values.gender !== 'all') {
      apiFilter.gender = values.gender;
    }

    if (values.birthDateOption === 'custom' && values.birthDateCustom) {
      apiFilter.birthDateFrom = format(startOfDay(values.birthDateCustom), 'yyyy-MM-dd');
      apiFilter.birthDateTo = format(endOfDay(values.birthDateCustom), 'yyyy-MM-dd');
    }

    if (values.spentAmountFrom) {
      apiFilter.spentAmountFrom = values.spentAmountFrom;
    }

    if (values.spentAmountTo) {
      apiFilter.spentAmountTo = values.spentAmountTo;
    }

    if (values.status !== 'all') {
      apiFilter.status = values.status;
    }

    onFilter(apiFilter);
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
              name="createBy"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Tên người tạo" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map((option) => (
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

          {/* Birthday */}
          <div className="space-y-2">
            <h3 className="font-medium">Ngày sinh</h3>
            <FormField
              control={form.control}
              name="birthDateOption"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="all" id="birthday-all-time" />
                      <Label htmlFor="birthday-all-time">Toàn thời gian</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="birthday-custom-radio" />
                      <div className="flex w-full items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !form.watch('birthDateCustom') && 'text-muted-foreground'
                              )}
                              onClick={() => form.setValue('birthDateOption', 'custom')}
                              disabled={form.watch('birthDateOption') !== 'custom'}
                            >
                              {form.watch('birthDateCustom') ? (
                                <span>{format(form.watch('birthDateCustom')!, 'dd/MM/yyyy')}</span>
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={form.watch('birthDateCustom')}
                              onSelect={(date) => form.setValue('birthDateCustom', date || undefined)}
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
            <h3 className="font-medium">Tổng chi tiêu</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-12 shrink-0 text-sm">Từ</div>
                <FormField
                  control={form.control}
                  name="spentAmountFrom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Nhập giá trị" type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 shrink-0 text-sm">Đến</div>
                <FormField
                  control={form.control}
                  name="spentAmountTo"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Nhập giá trị" type="number" {...field} />
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

          <Button type="submit" className="w-full">
            Áp dụng bộ lọc
          </Button>
        </form>
      </Form>
    </div>
  );
}
