import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { GetProductRequest, GetProductPriceRequest } from '@/apis/types/product';
import { useMeasurementUnits } from '@/apis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Sample users data
const users = [
  { label: 'John Doe', value: 'john' },
  { label: 'Jane Smith', value: 'jane' },
  { label: 'Robert Johnson', value: 'robert' },
  { label: 'Emily Davis', value: 'emily' },
];

interface TableFilterSidebarProps {
  onFilter: (values: GetProductRequest) => void;
}

export function TableFilterSidebar({ onFilter }: TableFilterSidebarProps) {
  const form = useForm<GetProductPriceRequest>({
    defaultValues: {
      categorySlug: 'all',
      fromPrice: '',
      toPrice: '',
      measurementUnitId: undefined,
    },
  });

  const { data: units } = useMeasurementUnits();
  const [groupOpen, setGroupOpen] = React.useState(false);

  function onSubmit(values: GetProductPriceRequest) {
    const apiFilter: GetProductPriceRequest = {};

    if (values.fromPrice) apiFilter.fromPrice = values.fromPrice;
    if (values.toPrice) apiFilter.toPrice = values.toPrice;
    if (values.measurementUnitId) apiFilter.measurementUnitId = values.measurementUnitId;

    // if (values.createdDateOption === 'custom' && values.createdDateCustom) {
    //   apiFilter.createdDateFrom = format(startOfDay(values.createdDateCustom), "yyyy-MM-dd'T'HH:mm:ss");
    //   apiFilter.createdDateTo = format(endOfDay(values.createdDateCustom), "yyyy-MM-dd'T'HH:mm:ss");
    // }

    // if (values.status !== 'all') {
    //   apiFilter.isActive = values.status === 'active';
    // }

    onFilter(apiFilter);
  }

  return (
    <div className="w-full max-w-xs space-y-6 rounded-lg border bg-background p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Group */}
          <div className="space-y-2">
            <h3 className="font-medium">Nhóm hàng</h3>
            <FormField
              control={form.control}
              name="categorySlug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover open={groupOpen} onOpenChange={setGroupOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={groupOpen}
                          className="w-full justify-between"
                        >
                          {field.value ? users.find((user) => user.value === field.value)?.label : 'Chọn nhóm hàng'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder="Tìm nhóm hàng..." />
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user.value}
                                  value={user.value}
                                  onSelect={(currentValue) => {
                                    form.setValue('categorySlug', currentValue === field.value ? '' : currentValue);
                                    setGroupOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === user.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {user.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <CommandEmpty>Ko thấy nhóm hàng nào.</CommandEmpty>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <h3 className="font-medium">Nhà cung cấp</h3>
            <FormField
              control={form.control}
              name="measurementUnitId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn don vi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units?.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id?.toString() || ''}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  name="fromPrice"
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
                  name="toPrice"
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

          <Button type="submit" className="w-full">
            Áp dụng bộ lọc
          </Button>
        </form>
      </Form>
    </div>
  );
}
