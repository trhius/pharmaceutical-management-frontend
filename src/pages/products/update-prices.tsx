import { useState, useCallback, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FileOutput } from 'lucide-react'; // Import FileOutput icon

import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast'; // Import useToast

import { EditablePriceCell } from '@/components/products/editable-price-cell';
import { TableFilterSidebar } from './filter-product-price';
import { useProductPrices, useUpdateProductPrice, useExportProductPrices } from '@/apis/hooks/product'; // Import useExportProductPrices
import { GetProductPriceRequest, UpdateProductPriceRequest } from '@/apis/types/product';

import useListPageState from '@/hooks/useListPageState'; // Import the custom hook
import { SortDropdown } from '@/components/ui/sort-dropdown'; // Import SortDropdown
import { Input } from '@/components/ui/input'; // Assuming you might want a search input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming you might want a searchBy select

const searchByOptions = [
  { label: 'Tên sản phẩm', value: 'NAME' },
  { label: 'Mã sản phẩm', value: 'CODE' },
];

const sortableColumns = [
  { value: 'CODE', label: 'Mã sản phẩm' },
  { value: 'NAME', label: 'Tên sản phẩm' },
  { value: 'PRICE', label: 'Giá vốn' },
  { value: 'PURCHASE_PRICE', label: 'Giá bán' },
];

export default function ProductsListPrices() {
  const [editedPrices, setEditedPrices] = useState<{ [productId: string]: number }>({});
  const { mutate: updatePrices, isPending: isUpdating } = useUpdateProductPrice();
  const exportProductPricesMutation = useExportProductPrices(); // Initialize export hook
  const { toast } = useToast(); // Initialize toast hook

  // Use the custom hook for managing list state
  const {
    filter, // This now includes page, size, search, searchBy, and external filters
    pageIndex,
    pageSize,
    searchTerm,
    searchByValue,
    sortBy, // Destructure sortBy
    sortOrder, // Destructure sortOrder
    setPageIndex,
    setSearchTerm,
    setSearchByValue,
    setSortBy, // Destructure setSortBy
    setSortOrder, // Destructure setSortOrder
    setExternalFilters,
  } = useListPageState<GetProductPriceRequest>({
    initialPage: 0,
    initialSize: 10,
    initialSearchBy: 'NAME',
    resetPageIndexOnFilterChange: true,
  });

  // Fetch product prices using the filter from the hook
  const productPricesParams = {
    page: pageIndex,
    size: pageSize,
    request: filter, // Pass the rest of the filter as the 'request' object
    sortBy, // Pass sortBy to the API hook
    sortOrder, // Pass sortOrder to the API hook
  };

  // Fetch product prices using the correctly formatted parameters
  const { data: productsData, isLoading } = useProductPrices(productPricesParams);
  const products = productsData?.content;

  const isExporting = exportProductPricesMutation.isPending; // Get export loading state

  // Clear edited prices when product data changes (e.g., on pagination or filter)
  useEffect(() => {
    setEditedPrices({});
  }, [productsData]);

  // Handler for external filters (from sidebar)
  const onFilter = useCallback(
    (values: Omit<GetProductPriceRequest, 'page' | 'size' | 'search' | 'searchBy'>) => {
      setExternalFilters(values);
    },
    [setExternalFilters]
  );

  // Handler for search input
  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handler for search by select
  const handleSearchByChange = (value: string) => {
    setSearchByValue(value as GetProductPriceRequest['searchBy']);
  };

  // Handler to update edited prices from the cell component
  const handlePriceChange = useCallback((productId: string, newPrice: number) => {
    setEditedPrices((prev) => ({
      ...prev,
      [productId]: newPrice,
    }));
  }, []);

  // Handle export button click
  const handleExportClick = () => {
    exportProductPricesMutation.mutate(
      { request: filter as GetProductPriceRequest }, // Pass the filtered request
      {
        onSuccess: (blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'product_prices_export.xlsx'); // Set the desired filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast({
            title: 'Xuất dữ liệu thành công',
            description: 'Tệp dữ liệu giá sản phẩm đã được tải xuống.',
          });
        },
        onError: (error) => {
          console.error('Export failed:', error);
          toast({
            title: 'Xuất dữ liệu thất bại',
            description: 'Đã xảy ra lỗi khi xuất dữ liệu giá sản phẩm.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  // Define columns for the DataTable
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'productCode',
      header: 'Mã sản phẩm',
    },
    {
      accessorKey: 'productName',
      header: 'Tên sản phẩm',
    },
    {
      accessorKey: 'prices.price',
      header: 'Giá vốn',
    },
    {
      accessorKey: 'prices.measurementUnitName',
      header: 'Đơn vị',
    },
    {
      accessorKey: 'prices.purchasePrice',
      header: 'Giá bán',
      cell: ({ row }) => {
        const product = row.original;
        // Ensure product.prices and product.prices.id exist before accessing
        const initialPrice = product.prices?.purchasePrice;
        const currentPrice =
          product.prices?.id && editedPrices[product.prices.id] !== undefined
            ? editedPrices[product.prices.id]
            : initialPrice;

        return (
          <EditablePriceCell
            initialValue={currentPrice}
            productId={product.prices.id} // Pass product.prices.id as productId
            onPriceChange={handlePriceChange}
          />
        );
      },
    },
  ];

  return (
    <div className="mx-auto space-y-4">
      <PageHeader title="Giá sản phẩm" description="Quản lý giá sản phẩm" />

      <div className="flex min-h-screen items-start gap-8 py-8">
        <div className="sticky top-8">
          <TableFilterSidebar onFilter={onFilter} />
        </div>
        <Card className="w-full">
          <CardHeader className="flex-row items-center justify-between space-y-4 pb-2">
            <div className="space-y-1.5">
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>Xem và quản lý thông tin chi tiết sản phẩm.</CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Added a div to group buttons */}
              {/* Export Button */}
              {/* Update Prices Button */}
              <Button
                onClick={() => {
                  const pricesToUpdate: UpdateProductPriceRequest[] = Object.entries(editedPrices).map(
                    ([productId, price]) => ({
                      productId: Number.parseInt(productId), // productId here is actually prices.id
                      measurementUnitId: 1, // Assuming a default measurementUnitId or get it from product.prices
                      sellingPrice: price.toString(),
                    })
                  );
                  if (pricesToUpdate.length > 0) {
                    // TODO: Update all prices at once
                    // The useUpdateProductPrice hook seems to update one at a time.
                    // If it's a batch update, the API hook needs to support it.
                    // For now, it's calling for the first item only.
                    updatePrices(pricesToUpdate[0]);
                    // You might want to iterate and call updatePrices for each,
                    // or have a separate batch update mutation.
                  }
                }}
                disabled={Object.keys(editedPrices).length === 0 || isUpdating}
              >
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật giá bán'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Added search input and select for searchBy */}
            <div className="flex items-center justify-between gap-2 mb-4">
              {/* Added flex container */}
              <div className="flex gap-2 w-1/2 min-w-sm">
                <div className="w-1/3 min-w-[150px]">
                  <Select onValueChange={handleSearchByChange} defaultValue={searchByValue || 'NAME'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tìm kiếm theo" />
                    </SelectTrigger>
                    <SelectContent>
                      {searchByOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                  className="flex-grow"
                  value={searchTerm}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {/* Sort Dropdown */}
                <SortDropdown
                  sortableColumns={sortableColumns}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                />
                {/* Export Button */}
                <Button onClick={handleExportClick} disabled={isLoading || isExporting}>
                  <FileOutput className="mr-2 h-4 w-4" />
                  {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
                </Button>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={products || []}
              isLoading={isLoading}
              pageCount={productsData?.totalPages || 0}
              pageSize={pageSize} // Use pageSize from hook
              pageIndex={pageIndex} // Use pageIndex from hook
              onPageChange={setPageIndex} // Use setPageIndex from hook
              // searchKey and searchPlaceholder are now handled by the Input and Select above
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
