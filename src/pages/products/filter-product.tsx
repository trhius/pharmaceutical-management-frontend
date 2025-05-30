import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format, startOfDay } from 'date-fns'; // Import format and date utility functions
import { GetProductRequest } from '@/apis/types/product';
import * as z from 'zod';
import { CategorySelect } from '@/components/category-select';
import { BrandSelect } from '@/components/brand-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang kinh doanh', value: 'active' },
  { label: 'Ngừng kinh doanh', value: 'inactive' },
];

const formSchema = z.object({
  createdDateOption: z.enum(['all', 'custom']),
  createdDateCustom: z.date().optional(),
  categorySlug: z.string().default(''),
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
      categorySlug: '',
      brand: '',
      status: 'all',
    },
  });

  function onSubmit(values: FormValues) {
    const apiFilter: GetProductRequest = {};

    if (values.createdDateOption === 'custom' && values.createdDateCustom) {
      apiFilter.createdAt = format(startOfDay(values.createdDateCustom), "yyyy-MM-dd'T'HH:mm:ss");
    }

    if (values.categorySlug) {
      apiFilter.categorySlug = values.categorySlug;
    }

    if (values.status !== 'all') {
      apiFilter.isActive = values.status === 'active';
    }

    apiFilter.brand = values.brand;

    onFilter(apiFilter);
  }

  return (
    <div className="w-full min-w-xs space-y-6 rounded-lg border bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Group */}
          <div className="space-y-2">
            <h3 className="font-medium">Nhóm hàng</h3>
            <CategorySelect name="categorySlug" />
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
            <h3 className="font-medium">Hãng sản xuất</h3>
            <BrandSelect name="brand" />
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
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
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
