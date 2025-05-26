import * as React from 'react';

import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { GetOrderListRequest } from '@/apis/types/sales';
import { format } from 'date-fns'; // Import format and date utility functions

interface OrderFilterProps {
  onFilter: (values: GetOrderListRequest) => void;
}

export function OrderFilter({ onFilter }: OrderFilterProps) {
  const form = useForm<GetOrderListRequest>({
    defaultValues: {
      search: '',
      searchBy: undefined,
      createdDateFrom: '',
      createdDateTo: '',
      status: undefined,
      paymentMethod: undefined,
    },
  });

  function onSubmit(values: GetOrderListRequest) {
    const apiFilter: GetOrderListRequest = {};

    if (values.search) apiFilter.search = values.search;
    if (values.searchBy) apiFilter.searchBy = values.searchBy;
    if (values.createdDateFrom) {
      apiFilter.createdDateFrom = format(values.createdDateFrom, "yyyy-MM-dd'T'HH:mm:ss");
    }
    if (values.createdDateTo) {
      apiFilter.createdDateTo = format(values.createdDateTo, "yyyy-MM-dd'T'HH:mm:ss");
    }
    if (values.status) apiFilter.status = values.status;
    if (values.paymentMethod) apiFilter.paymentMethod = values.paymentMethod;

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

          {/* Date Range */}
          <div className="space-y-2">
            <h3 className="font-medium">Khoảng ngày tạo</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-12 shrink-0 text-sm">Từ</div>
                <FormField
                  control={form.control}
                  name="createdDateFrom"
                  render={() => (
                    <FormItem className="flex-1 w-full">
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="w-full"
                              variant="outline"
                            >
                              {form.watch('createdDateFrom') ? (
                                <span>{format(form.watch('createdDateFrom')!, 'dd/MM/yyyy')}</span>
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={form.watch('createdDateFrom')}
                              onSelect={(date) => form.setValue('createdDateFrom', date || undefined)}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 shrink-0 text-sm">Đến</div>
                <FormField
                  control={form.control}
                  name="createdDateTo"
                  render={() => (
                    <FormItem className="flex-1 w-full">
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="w-full"
                              variant="outline"
                            >
                              {form.watch('createdDateTo') ? (
                                <span>{format(form.watch('createdDateTo')!, 'dd/MM/yyyy')}</span>
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={form.watch('createdDateTo')}
                              onSelect={(date) => form.setValue('createdDateTo', date || undefined)}
                            />
                          </PopoverContent>
                        </Popover>
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
