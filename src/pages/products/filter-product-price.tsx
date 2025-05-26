import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { GetProductRequest, GetProductPriceRequest } from '@/apis/types/product';
import { useMeasurementUnits } from '@/apis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CategorySelect } from '@/components/category-select';

interface TableFilterSidebarProps {
  onFilter: (values: GetProductRequest) => void;
}

export function TableFilterSidebar({ onFilter }: TableFilterSidebarProps) {
  const form = useForm<GetProductPriceRequest>({
    defaultValues: {
      categorySlug: undefined,
      fromPrice: '',
      toPrice: '',
      measurementUnitId: undefined,
    },
  });

  const { data: units } = useMeasurementUnits();

  function onSubmit(values: GetProductPriceRequest) {
    const apiFilter: GetProductPriceRequest = {};

    if (values.fromPrice) apiFilter.fromPrice = values.fromPrice;
    if (values.toPrice) apiFilter.toPrice = values.toPrice;
    if (values.measurementUnitId) apiFilter.measurementUnitId = values.measurementUnitId;
    if (values.categorySlug) apiFilter.categorySlug = values.categorySlug;

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

          {/* Unit */}
          <div className="space-y-2">
            <h3 className="font-medium">Đơn vị</h3>
            <FormField
              control={form.control}
              name="measurementUnitId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị" />
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
            <h3 className="font-medium">Giá</h3>
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
