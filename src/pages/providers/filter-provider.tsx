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
      isActive: initialFilters.isActive ? 'true' : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      search: initialFilters.search || '',
      searchBy: initialFilters.searchBy || 'all-search',
      fromDate: initialFilters.fromDate ? new Date(initialFilters.fromDate) : undefined,
      toDate: initialFilters.toDate ? new Date(initialFilters.toDate) : undefined,
      isActive: initialFilters.isActive ? 'true' : undefined,
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

  // const handleReset = () => {
  //   const resetValues: FilterFormValues = {
  //     search: '',
  //     searchBy: 'all-search',
  //     fromDate: undefined,
  //     toDate: undefined,
  //     isActive: undefined,
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

          {/* Date Range */}
          <div className="space-y-2">
            <h3 className="font-medium">Khoảng ngày tạo</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-12 shrink-0 text-sm">Từ</div>
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={() => (
                    <FormItem className="flex-1 w-full">
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="w-full"
                              variant="outline"
                            >
                              {form.watch('fromDate') ? (
                                <span>{format(form.watch('fromDate')!, 'dd/MM/yyyy')}</span>
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={form.watch('fromDate')}
                              onSelect={(date) => form.setValue('fromDate', date)}
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
                  name="toDate"
                  render={() => (
                    <FormItem className="flex-1 w-full">
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="w-full"
                              variant="outline"
                            >
                              {form.watch('toDate') ? (
                                <span>{format(form.watch('toDate')!, 'dd/MM/yyyy')}</span>
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={form.watch('toDate')}
                              onSelect={(date) => form.setValue('toDate', date || undefined)}
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
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
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

          <Button className="w-full" type="submit">Áp dụng bộ lọc</Button>
        </form>
      </Form>
    </div>
  );
};
