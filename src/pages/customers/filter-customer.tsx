
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'; // Added FormLabel
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, startOfDay, endOfDay } from 'date-fns'; // Import format and date utility functions

import { CustomerListRequest } from '@/apis/types/customer';
import { DateRangeSelector } from '@/components/date-range-selector';

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
  createdDateCustom: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  createBy: z.string().optional(),
  gender: z.enum(['all', 'MALE', 'FEMALE', 'OTHER']),
  birthDateOption: z.enum(['all', 'custom']),
  birthDateCustom: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
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
      createdDateCustom: { from: new Date(), to: new Date() },
      gender: 'all',
      birthDateOption: 'all',
      birthDateCustom: { from: new Date(), to: new Date() },
      status: 'all',
      spentAmountFrom: '',
      spentAmountTo: '',
      createBy: '',
    },
  });

  function onSubmit(values: FormValues) {
    const apiFilter: CustomerListRequest = {};

    if (values.createdDateOption === 'custom' && values.createdDateCustom?.from) {
      apiFilter.createdDateFrom = format(startOfDay(values.createdDateCustom.from), "yyyy-MM-dd'T'HH:mm:ss");
      if (values.createdDateCustom.to) {
        apiFilter.createdDateTo = format(endOfDay(values.createdDateCustom.to), "yyyy-MM-dd'T'HH:mm:ss");
      }
    }

    if (values.createBy) {
      apiFilter.createBy = values.createBy;
    }

    if (values.gender !== 'all') {
      apiFilter.gender = values.gender;
    }

    if (values.birthDateOption === 'custom' && values.birthDateCustom?.from) {
      apiFilter.birthDateFrom = format(startOfDay(values.birthDateCustom.from), 'yyyy-MM-dd');
      if (values.birthDateCustom.to) {
        apiFilter.birthDateTo = format(endOfDay(values.birthDateCustom.to), 'yyyy-MM-dd');
      }
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
    <div className="w-full min-w-xs flex-shrink-0 space-y-6 rounded-lg border bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Creation Date */}
          <DateRangeSelector
            namePrefix="createdDate"
            label="Ngày tạo"
            dateFormat="dd/MM/yyyy"
          />

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
          <DateRangeSelector
            namePrefix="birthDate"
            label="Ngày sinh"
            dateFormat="dd/MM/yyyy"
          />

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

