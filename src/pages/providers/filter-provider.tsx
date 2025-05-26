import React, { useEffect } from 'react';
import { SupplierListRequest } from '@/apis/types/supplier';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface ProviderFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SupplierListRequest) => void;
  initialFilters: SupplierListRequest;
}

const filterSchema = z.object({
  search: z.string().optional(),
  searchBy: z.enum(['NAME', 'CODE', 'PHONE', 'all-search']).optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
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
      fromDate: initialFilters.fromDate ? new Date(initialFilters.fromDate) : undefined,
      toDate: initialFilters.toDate ? new Date(initialFilters.toDate) : undefined,
      isActive: initialFilters.isActive === undefined ? 'all-status' : initialFilters.isActive.toString(),
    },
  });

  useEffect(() => {
    form.reset({
      search: initialFilters.search || '',
      searchBy: initialFilters.searchBy || 'all-search',
      fromDate: initialFilters.fromDate ? new Date(initialFilters.fromDate) : undefined,
      toDate: initialFilters.toDate ? new Date(initialFilters.toDate) : undefined,
      isActive: initialFilters.isActive === undefined ? 'all-status' : initialFilters.isActive.toString(),
    });
  }, [initialFilters, form]);

  const onSubmit = (values: FilterFormValues) => {
    const apiFilters: SupplierListRequest = {
      search: values.search || undefined,
      searchBy: values.searchBy === 'all-search' ? undefined : values.searchBy,
      fromDate: values.fromDate ? format(values.fromDate, 'yyyy-MM-dd') : undefined,
      toDate: values.toDate ? format(values.toDate, 'yyyy-MM-dd') : undefined,
      isActive: values.isActive === 'all-status' ? undefined : values.isActive === 'true',
    };
    onApplyFilters(apiFilters);
  };

  const handleReset = () => {
    const resetValues: FilterFormValues = {
      search: '',
      searchBy: 'all-search',
      fromDate: undefined,
      toDate: undefined,
      isActive: 'all-status',
    };
    form.reset(resetValues);
    onApplyFilters({}); // Apply empty filters
  };

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

          {/* From Date */}
          <div className="space-y-2">
            <h3 className="font-medium">Từ ngày</h3>
            <FormField
              control={form.control}
              name="fromDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <h3 className="font-medium">Đến ngày</h3>
            <FormField
              control={form.control}
              name="toDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

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

          <div className="flex justify-between mt-6">
            <Button variant="outline" type="button" onClick={handleReset}>
              Đặt lại
            </Button>
            <Button type="submit">Áp dụng bộ lọc</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
