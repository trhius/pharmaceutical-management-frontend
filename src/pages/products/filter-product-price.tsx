import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { GetProductRequest, GetProductPriceRequest, GetListCategoryResponse } from '@/apis/types/product';
import { useAllCategories, useMeasurementUnits } from '@/apis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TreeDataItem, TreeView } from '@/components/tree-view';

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

  const { data: categories } = useAllCategories();

  // Flatten categories
  const flatCategories = React.useMemo(() => {
    if (!categories) return [];
    const flatCategories: GetListCategoryResponse[] = [];
    function flatten(category: GetListCategoryResponse) {
      if (!category) return;
      const { children, ...rest } = category;
      flatCategories.push(rest);
      children?.forEach((child) => flatten(child));
    }

    categories.forEach((category) => flatten(category));
    return flatCategories;
  }, [categories]);

  // TreeView data
  const treeViewData = React.useMemo(() => {
    if (!categories) return [];

    function convertToTreeViewData(category: GetListCategoryResponse): TreeDataItem | undefined {
      if (!category) return;
      const { children, ...rest } = category;
      const convertChildren = children?.length
        ? children.map((child) => convertToTreeViewData(child)).filter((child) => !!child)
        : undefined;

      return {
        id: rest.slug || '',
        name: rest.name || '',
        children: convertChildren,
      };
    }

    return categories.map((category) => convertToTreeViewData(category));
  }, [categories]);

  const { data: units } = useMeasurementUnits();
  const [groupOpen, setGroupOpen] = React.useState(false);

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
            <FormField
              control={form.control}
              name="categorySlug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover
                      open={groupOpen}
                      onOpenChange={(isOpen) => {
                        // Prevent closing popover when expanding/collapsing tree items
                        if (!isOpen && !groupOpen) {
                          setGroupOpen(false);
                        } else {
                          setGroupOpen(isOpen);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full rounded-md border px-3 py-2 text-left text-sm font-medium"
                        >
                          {flatCategories?.find((cat) => cat.slug === field.value)?.name || 'Chọn nhóm hàng'}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <TreeView
                          data={treeViewData as unknown as TreeDataItem}
                          initialSelectedItemId={field.value}
                          onSelectChange={(item) => {
                            if (item) {
                              form.setValue('categorySlug', item.id);
                              // setGroupOpen(false);
                            }
                          }}
                          className="max-h-[400px] overflow-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
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
