import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { endOfDay, format, startOfDay } from 'date-fns';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangeSelector } from '@/components/date-range-selector';
import { PurchaseListRequest, PurchaseOrderStatus } from '@/apis/types/purchase';
import { Input } from '@/components/ui/input';

const statusOptions: { label: string; value: PurchaseOrderStatus | 'all' }[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Phiếu tạm', value: 'DRAFT' },
    { label: 'Đã nhập hàng', value: 'CONFIRMED' },
    { label: 'Đã hủy', value: 'CANCELLED' },
];

const formSchema = z.object({
  createdDateOption: z.enum(['all', 'custom']),
  createdDateCustom: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  status: z.enum(['all', 'DRAFT', 'CONFIRMED', 'CANCELLED']),
  createdBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TableFilterSidebarProps {
  onFilter: (values: PurchaseListRequest) => void;
}

// Draft for the filter sidebar
export const TableFilterSidebar = ({ onFilter }: TableFilterSidebarProps ) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdDateOption: 'all',
      createdDateCustom: { from: new Date(), to: new Date() },
      status: 'all',
      createdBy: '',
    },
  });

  function onSubmit(values: FormValues) {
    const apiFilter: PurchaseListRequest = {};

    if (values.createdDateOption === 'custom' && values.createdDateCustom?.from) {
      apiFilter.createdDateFrom = format(startOfDay(values.createdDateCustom.from), "yyyy-MM-dd'T'HH:mm:ss");
      if (values.createdDateCustom.to) {
        apiFilter.createdDateTo = format(endOfDay(values.createdDateCustom.to), "yyyy-MM-dd'T'HH:mm:ss");
      }
    }

    if (values.createdBy) {
      apiFilter.createdBy = values.createdBy;
    }

    if (values.status !== 'all') {
      apiFilter.status = values.status;
    }

    onFilter(apiFilter);
  }

  return (
    <div className="w-full min-w-xs space-y-6 rounded-lg border bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Creation Date */}
          <div className="space-y-2">
            <DateRangeSelector namePrefix="createdDate" label="Ngày tạo" dateFormat="dd/MM/yyyy" />
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

          {/* Creator */}
          <div className="space-y-2">
              <h3 className="font-medium">Người tạo</h3>
              <FormField
                control={form.control}
                name="createdBy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Tên người tạo" {...field} />
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