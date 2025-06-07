import * as React from 'react';
import { useState } from 'react';
import { useCustomers } from '@/apis/hooks/customer';
import { CustomerListRequest, CustomerResponse } from '@/apis/types/customer';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomerComboBoxProps {
  onCustomerSelect: (customer: CustomerResponse | null) => void;
  selectedCustomer: CustomerResponse | null;
}

export function CustomerComboBox({ onCustomerSelect, selectedCustomer }: CustomerComboBoxProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [customerSearchKeyword, setCustomerSearchKeyword] = useState('');
  const [customerPageIndex, setCustomerPageIndex] = useState(0); // For pagination

  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers,
  } = useCustomers({
    page: customerPageIndex,
    size: 10,
    enabled: popoverOpen || customerSearchKeyword.length > 0, // Fetch when open or search term exists
    request: { searchBy: 'NAME', search: customerSearchKeyword } as CustomerListRequest,
  });

  const customers = customersData?.content || [];
  const customerTotalPages = customersData?.totalPages || 0;

  const handleSelectCustomer = (customer: CustomerResponse) => {
    onCustomerSelect(customer);
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={popoverOpen}
          className="w-fit flex-grow justify-between"
        >
          {selectedCustomer
            ? selectedCustomer.name
            : 'Chọn khách hàng'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0"> {/* Adjust width as needed */}
        <Command>
          <CommandInput
            placeholder="Tìm khách hàng..."
            value={customerSearchKeyword}
            onValueChange={(val) => { console.log(val); setCustomerSearchKeyword(val) }}
          />
          <CommandList>
            {isLoadingCustomers ? (
              <CommandEmpty>Đang tải khách hàng...</CommandEmpty>
            ) : isErrorCustomers ? (
              <CommandEmpty>Lỗi khi tải khách hàng.</CommandEmpty>
            ) : customers.length === 0 ? (
              <CommandEmpty>Không tìm thấy khách hàng nào.</CommandEmpty>
            ) : (
              <CommandGroup>
                {customers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={`${customer.customerCode} - ${customer.name}` || ''} // Use customer name for search/display in CommandInput
                    onSelect={() => handleSelectCustomer(customer)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCustomer?.id === customer.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="mr-2">{customer.name}</span>
                    <span className="text-gray-600 dark:text-gray-500">({customer.customerCode})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          {/* Basic Pagination for customers */}
          {customerTotalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-2 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomerPageIndex(Math.max(0, customerPageIndex - 1))}
                disabled={customerPageIndex === 0}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-xs text-gray-900 dark:text-gray-100">
                {customerPageIndex + 1}/{customerTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomerPageIndex(Math.min(customerTotalPages - 1, customerPageIndex + 1))}
                disabled={customerPageIndex + 1 >= customerTotalPages}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
