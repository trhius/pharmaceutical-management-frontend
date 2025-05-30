import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { endOfDay, format, startOfDay } from 'date-fns'; // Import format and date utility functions
import { GetProductRequest } from '@/apis/types/product';
import * as z from 'zod';
import { CategorySelect } from '@/components/category-select';
import { BrandSelect } from '@/components/brand-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangeSelector } from '@/components/date-range-selector';

const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang kinh doanh', value: 'active' },
  { label: 'Ngừng kinh doanh', value: 'inactive' },
];

const formSchema = z.object({
  createdDateOption: z.enum(['all', 'custom']),
  createdDateCustom: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
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
      createdDateCustom: { from: new Date(), to: new Date() },
      categorySlug: '',
      brand: '',
      status: 'all',
    },
  });

  function onSubmit(values: FormValues) {
    const apiFilter: GetProductRequest = {};

    if (values.createdDateOption === 'custom' && values.createdDateCustom?.from) {
      apiFilter.createdDateFrom = format(startOfDay(values.createdDateCustom.from), "yyyy-MM-dd'T'HH:mm:ss");
      if (values.createdDateCustom.to) {
        apiFilter.createdDateTo = format(endOfDay(values.createdDateCustom.to), "yyyy-MM-dd'T'HH:mm:ss");
      }
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
            <DateRangeSelector namePrefix="createdDate" label="Ngày tạo" dateFormat="dd/MM/yyyy" />
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
