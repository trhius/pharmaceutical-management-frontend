import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField, FormControl, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';

import { useAllStores } from '@/apis';

interface StoreSelectProps {
  name: string; // The name of the form field (e.g., 'storeId')
  prefetch?: boolean;
  placeholder?: string;
  // Any other props you might need for customization
}

export function StoreSelect({ name, prefetch = false, placeholder = 'Chọn chi nhánh' }: StoreSelectProps) {
  const { control } = useFormContext();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // Fetch stores data only when the popover is open
  const { data: stores, isLoading } = useAllStores({
    enabled: prefetch || popoverOpen,
  });

  // Filter stores based on search input
  const filteredStores = React.useMemo(() => {
    if (!stores) return [];
    if (!search) return stores;
    return stores.filter((store) => store.name?.toLowerCase().includes(search.toLowerCase()));
  }, [stores, search]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Popover
              modal={true}
              open={popoverOpen}
              onOpenChange={(isOpen) => {
                setPopoverOpen(isOpen);
                // Reset search when closing
                if (!isOpen) {
                  setSearch('');
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  {field.value ? stores?.find((store) => store.id === field.value)?.name : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Tìm chi nhánh..." value={search} onValueChange={setSearch} />
                  <CommandList>
                    {isLoading ? (
                      <CommandEmpty>Đang tải...</CommandEmpty>
                    ) : filteredStores.length === 0 ? (
                      <CommandEmpty>Không tìm thấy chi nhánh.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {filteredStores.map((store) => (
                          <CommandItem
                            key={store.id}
                            value={store.id?.toString()} // Ensure value is a string
                            onSelect={(currentValue) => {
                              // Convert the string value back to the correct type (number) for the form
                              const selectedStoreId =
                                currentValue === field.value?.toString() ? undefined : Number(currentValue);
                              field.onChange(selectedStoreId);
                              setSearch(''); // Clear search after selection
                              setPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn('mr-2 h-4 w-4', field.value === store.id ? 'opacity-100' : 'opacity-0')}
                            />
                            {store.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
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
