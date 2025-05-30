import React, { useEffect } from 'react';
import { SupplierListRequest } from '@/apis/types/supplier';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, startOfDay, endOfDay } from 'date-fns'; // Import startOfDay and endOfDay
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DateRangeSelector } from '@/components/date-range-selector'; // Import the new DateRangeSelector component

interface ProviderFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SupplierListRequest) => void;
  initialFilters: SupplierListRequest;
}

const filterSchema = z.object({
  search: z.string().optional(),
  searchBy: z.enum(['NAME', 'CODE', 'PHONE', 'all-search']).optional(),
  // Updated schema for date range
  dateRangeOption: z.enum(['all', 'custom']),
  dateRangeCustom: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  isActive: z.enum(['true', 'false', 'all-status']).optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export const ProviderFilterSidebar: React.FC<ProviderFilterSidebarProps> = ({
  isOpen,
  onApplyFilters,
  initialFilters,
}) => {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: initialFilters.search || '',
      searchBy: initialFilters.searchBy || 'all-search',
      // Set default values for the new date range fields
      dateRangeOption: 'all', // Default to 'all'
      dateRangeCustom: {
        from: initialFilters.fromDate ? new Date(initialFilters.fromDate) : new Date(),
        to: initialFilters.toDate ? new Date(initialFilters.toDate) : undefined, // 'to' can be optional
      },
      isActive: initialFilters.isActive === true ? 'true' : initialFilters.isActive === false ? 'false' : 'all-status', // Handle initial boolean
    },
  });

  useEffect(() => {
    // Reset form values when initialFilters change
    form.reset({
      search: initialFilters.search || '',
      searchBy: initialFilters.searchBy || 'all-search',
      dateRangeOption: initialFilters.fromDate || initialFilters.toDate ? 'custom' : 'all',
      dateRangeCustom: {
        from: initialFilters.fromDate ? new Date(initialFilters.fromDate) : new Date(),
        to: initialFilters.toDate ? new Date(initialFilters.toDate) : undefined,
      },
      isActive: initialFilters.isActive === true ? 'true' : initialFilters.isActive === false ? 'false' : 'all-status',
    });
  }, [initialFilters, form]);

  const onSubmit = (values: FilterFormValues) => {
    const apiFilters: SupplierListRequest = {
      search: values.search || undefined,
      searchBy: values.searchBy === 'all-search' ? undefined : values.searchBy,
      isActive: values.isActive === 'all-status' ? undefined : values.isActive === 'true',
    };

    // Apply date range filters based on the selected option
    if (values.dateRangeOption === 'custom' && values.dateRangeCustom?.from) {
      apiFilters.fromDate = format(startOfDay(values.dateRangeCustom.from), "yyyy-MM-dd'T'HH:mm:ss");
      if (values.dateRangeCustom.to) {
        apiFilters.toDate = format(endOfDay(values.dateRangeCustom.to), "yyyy-MM-dd'T'HH:mm:ss");
      }
    }

    onApplyFilters(apiFilters);
  };

  // const handleReset = () => {
  //   const resetValues: FilterFormValues = {
  //     search: '',
  //     searchBy: 'all-search',
  //     dateRangeOption: 'all', // Reset to 'all'
  //     dateRangeCustom: { from: new Date(), to: new Date() }, // Reset custom date range
  //     isActive: 'all-status', // Reset status
  //   };
  //   form.reset(resetValues);
  //   onApplyFilters({}); // Apply empty filters
  // };

  if (!isOpen) return null;

  return (
    <div className="w-full min-w-xs flex-shrink-0 space-y-6 rounded-lg border bg-background p-4">
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
                    <Input placeholder="Nhập từ khóa tìm kiếm" {...field} value={field.value || ''} />
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
                  <Select onValueChange={field.onChange} value={field.value || 'all-search'}>
                    <FormControl>
                      <SelectTrigger id="searchBy">
                        <SelectValue placeholder="Chọn trường" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all-search">Tất cả</SelectItem>
                      <SelectItem value="NAME">Tên</SelectItem>
                      <SelectItem value="CODE">Mã</SelectItem>
                      <SelectItem value="PHONE">Số điện thoại</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Date Range - Using the new DateRangeSelector component */}
          <DateRangeSelector
            namePrefix="dateRange"
            label="Khoảng ngày tạo"
            dateFormat="dd/MM/yyyy"
          />

          {/* Status */}
          <div className="space-y-2">
            <h3 className="font-medium">Trạng thái</h3>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value || 'all-status'}>
                    <FormControl>
                      <SelectTrigger id="isActive">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all-status">Tất cả</SelectItem>
                      <SelectItem value="true">Đang hoạt động</SelectItem>
                      <SelectItem value="false">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full" type="submit">
            Áp dụng bộ lọc
          </Button>
        </form>
      </Form>
    </div>
  );
};
