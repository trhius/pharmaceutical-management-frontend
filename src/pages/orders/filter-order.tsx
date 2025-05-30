import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { OrderListRequest } from '@/apis/types/sales';
import { format, startOfDay, endOfDay } from 'date-fns'; // Import format, startOfDay, and endOfDay
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateRangeSelector } from '@/components/date-range-selector'; // Import the new DateRangeSelector component

const formSchema = z.object({
  search: z.string().optional(),
  searchBy: z.string().optional(),
  // Updated schema for date range
  createdDateOption: z.enum(['all', 'custom']),
  createdDateCustom: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  status: z.enum(['NEW', 'COMPLETED', 'CANCELLED', 'RETURNED']).optional(),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'MOBILE_PAYMENT', 'OTHER']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface OrderFilterProps {
  onFilter: (values: OrderListRequest) => void;
}

export function OrderFilter({ onFilter }: OrderFilterProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: undefined,
      searchBy: undefined,
      // Set default values for the new date range fields
      createdDateOption: 'all',
      createdDateCustom: { from: new Date(), to: undefined },
      status: undefined,
      paymentMethod: undefined,
    },
  });

  function onSubmit(values: FormValues) {
    const apiFilter: OrderListRequest = {};

    if (values.search) apiFilter.search = values.search;
    if (values.searchBy) apiFilter.searchBy = values.searchBy as OrderListRequest['searchBy'];

    // Apply date range filters based on the selected option
    if (values.createdDateOption === 'custom' && values.createdDateCustom?.from) {
      apiFilter.createdDateFrom = format(startOfDay(values.createdDateCustom.from), "yyyy-MM-dd'T'HH:mm:ss");
      if (values.createdDateCustom.to) {
        apiFilter.createdDateTo = format(endOfDay(values.createdDateCustom.to), "yyyy-MM-dd'T'HH:mm:ss");
      }
    }

    if (values.status) apiFilter.status = values.status as OrderListRequest['status'];
    if (values.paymentMethod) apiFilter.paymentMethod = values.paymentMethod as OrderListRequest['paymentMethod'];

    console.log({ apiFilter });

    onFilter(apiFilter);
  }

  return (
    <div className="w-full min-w-xs space-y-6 rounded-lg border bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <h3 className="font-medium">Tìm kiếm</h3>
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nhập từ khóa tìm kiếm" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Search By */}
          <div className="space-y-2">
            <h3 className="font-medium">Tìm kiếm theo</h3>
            <FormField
              control={form.control}
              name="searchBy"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trường tìm kiếm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ORDER_CODE">Mã đơn hàng</SelectItem>
                      <SelectItem value="CUSTOMER_NAME">Tên khách hàng</SelectItem>
                      <SelectItem value="CUSTOMER_PHONE">Số điện thoại khách hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Date Range - Using the new DateRangeSelector component */}
          <DateRangeSelector
            namePrefix="createdDate"
            label="Khoảng ngày tạo"
            dateFormat="dd/MM/yyyy"
          />

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
                      <SelectItem value="NEW">Mới</SelectItem>
                      <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      <SelectItem value="RETURNED">Đã trả hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <h3 className="font-medium">Phương thức thanh toán</h3>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">Tiền mặt</SelectItem>
                      <SelectItem value="CREDIT_CARD">Thẻ tín dụng</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem>
                      <SelectItem value="MOBILE_PAYMENT">Thanh toán di động</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
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
