import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField, FormControl, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';

import { useBrands } from '@/apis/hooks/product';

interface BrandSelectProps {
  name: string; // The name of the form field (e.g., 'brand')
  // Any other props you might need for customization
}

export function BrandSelect({ name }: BrandSelectProps) {
  const { control } = useFormContext();
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  // Fetch brands data only when the popover is open
  const { data: brands, isLoading } = useBrands({
    enabled: popoverOpen, // Only fetch when popover is open
  });

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
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  {field.value
                    ? brands?.find((brand) => brand === field.value)
                    : 'Chọn hãng sản xuất'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Tìm hãng sản xuất..." />
                    {isLoading ? (
                      <CommandEmpty>Đang tải...</CommandEmpty>
                    ) : (
                      <CommandEmpty>Không tìm thấy hãng sản xuất.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {brands?.map((brand) => (
                        <CommandItem
                          key={brand}
                          value={brand}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue === field.value ? '' : currentValue);
                            setPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === brand ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {brand}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
