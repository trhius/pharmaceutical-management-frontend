import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField, FormControl, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TreeDataItem, TreeView } from '@/components/tree-view'; // Assuming TreeView and TreeDataItem types are correct
import { useAllCategories } from '@/apis/hooks/product';
import { GetListCategoryResponse } from '@/apis/types/product';
import { Button } from './ui/button';

interface CategorySelectProps {
  name: string; // The name of the form field (e.g., 'categorySlug')
  // Any other props you might need for customization
}

export function CategorySelect({ name }: CategorySelectProps) {
  const { control } = useFormContext();

  const [popoverOpen, setPopoverOpen] = React.useState(false); // State to control popover open

  // Fetch categories only when the popover is open
  const { data: categories } = useAllCategories({
    enabled: popoverOpen, // Only fetch when popover is open
  });

  // Flatten categories for display label
  const flatCategories = React.useMemo(() => {
    if (!categories) return [];
    const flatCategories: GetListCategoryResponse[] = [];
    function flatten(category: GetListCategoryResponse) {
      if (!category) return;
      const { children, ...rest } = category;
      flatCategories.push(rest);
      children?.forEach((child) => flatten(child));
    }

    // Process each root category
    categories.forEach((category) => flatten(category));
    return flatCategories;
  }, [categories]);

  // TreeView data
  const treeViewData = React.useMemo(() => {
    if (!categories) return [];

    function convertToTreeViewData(category: GetListCategoryResponse): TreeDataItem | undefined {
      if (!category) return;
      const { children, ...rest } = category;
      const convertedChildren = children?.length
        ? children.map((child) => convertToTreeViewData(child)).filter((child) => !!child)
        : undefined;

      return {
        id: rest.slug || '',
        name: rest.name || '',
        children: convertedChildren,
      };
    }

    // TreeView expects an array of root items
    return categories.map((category) => convertToTreeViewData(category)).filter((item) => !!item) as TreeDataItem[];
  }, [categories]);

  // Helper function to find category name by slug
  const getCategoryName = (slug: string) => {
    if (!slug) return 'Chọn nhóm hàng';
    return flatCategories.find((cat) => cat.slug === slug)?.name || 'Chọn nhóm hàng';
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  {getCategoryName(field.value)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                {/* Render TreeView only if categories data is available */}
                {categories ? (
                  <TreeView
                    data={treeViewData}
                    initialSelectedItemId={field.value}
                    onSelectChange={(item) => {
                      // If an item is selected, set the form value to its ID (slug) and close the popover
                      if (item) {
                        field.onChange(item.id); // Use field.onChange from render prop
                        // setPopoverOpen(false);
                      } else {
                        // Handle deselection if TreeView supports passing null/undefined
                        field.onChange(''); // Set to empty string for "no category"
                        // setPopoverOpen(false);
                      }
                    }}
                    className="max-h-[400px] overflow-auto"
                  />
                ) : (
                  // Optional: Show a loading indicator or message while fetching
                  <div className="p-4 text-center text-sm">Đang tải...</div>
                )}
              </PopoverContent>
            </Popover>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
