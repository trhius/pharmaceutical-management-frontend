import { useState, useCallback, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FileOutput } from 'lucide-react'; // Import FileOutput icon

import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

import { EditablePriceCell } from '@/components/products/editable-price-cell';
import { TableFilterSidebar } from './filter-product-price';
import { useProductPrices, useUpdateProductPrice, useExportProductPrices } from '@/apis/hooks/product'; // Import useExportProductPrices
import {
  GetProductPriceRequest,
  ProductPriceListResponse,
  UpdateProductPriceRequest,
} from '@/apis/types/product';

import useListPageState from '@/hooks/useListPageState'; // Import the custom hook
import { SortDropdown } from '@/components/ui/sort-dropdown'; // Import SortDropdown
import { Input } from '@/components/ui/input'; // Assuming you might want a search input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming you might want a searchBy select

const searchByOptions = [
  { label: 'Tên sản phẩm', value: 'NAME' },
  { label: 'Mã sản phẩm', value: 'CODE' },
  { value: 'PRICE', label: 'Giá bán' },
  { value: 'PURCHASE_PRICE', label: 'Giá nhập' },
];

const sortableColumns = [
  { value: 'CODE', label: 'Mã sản phẩm' },
  { value: 'NAME', label: 'Tên sản phẩm' },
  { value: 'PRICE', label: 'Giá bán' },
  { value: 'PURCHASE_PRICE', label: 'Giá nhập' },
];

interface PriceChangeInfo {
  productId: number;
  measurementUnitId: number;
  newPrice: number;
  productCode: string;
}

export default function ProductsListPrices() {
  const { mutate: updatePrices, isPending: isUpdating } = useUpdateProductPrice();
  const exportProductPricesMutation = useExportProductPrices(); // Initialize export hook
  const { toast } = useToast(); // Initialize toast hook
  const queryClient = useQueryClient();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [priceChangeToConfirm, setPriceChangeToConfirm] = useState<PriceChangeInfo | null>(null);

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

  // This function is triggered when a price is changed in an EditablePriceCell
  const handlePriceChange = (priceIdStr: string, newPrice: number) => {
    const priceId = Number(priceIdStr);
    if (isNaN(priceId) || !products) return;

    // Find the product and price info related to the change
    for (const product of products) {
      if (product.prices && product.prices.id === priceId) {
        setPriceChangeToConfirm({
          productId: product.productId!,
          measurementUnitId: product.prices.measurementUnitId!,
          newPrice,
          productCode: product.productCode!,
        });
        setIsConfirmOpen(true);
        return; // Exit after finding the product
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, productId: string) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newPrice = parseFloat(event.currentTarget.value);
      if (!isNaN(newPrice)) {
        handlePriceChange(productId, newPrice);
      }
    }
  };

  const handleConfirmUpdate = () => {
    if (!priceChangeToConfirm) return;

    const { productId, measurementUnitId, newPrice } = priceChangeToConfirm;
    const payload: UpdateProductPriceRequest = {
      productId,
      measurementUnitId,
      sellingPrice: newPrice.toString(),
    };

    updatePrices(payload, {
      onSuccess: () => {
        toast({
          title: 'Cập nhật giá thành công',
          description: `Giá cho sản phẩm ${priceChangeToConfirm.productCode} đã được cập nhật.`,
        });
        queryClient.invalidateQueries({ queryKey: ['productPrices'] });
      },
      onError: (error) => {
        toast({
          title: 'Cập nhật giá thất bại',
          description: error.message || 'Đã có lỗi xảy ra.',
          variant: 'destructive',
        });
      },
      onSettled: () => {
        setIsConfirmOpen(false);
        setPriceChangeToConfirm(null);
      },
    });
  };

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
          link.setAttribute('download', `DanhSachGiaSanPham_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
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
      accessorKey: 'prices.purchasePrice',
      header: 'Giá nhập',
    },
    {
      accessorKey: 'prices.measurementUnitName',
      header: 'Đơn vị',
    },
    {
      accessorKey: 'prices.price',
      header: 'Giá bán',
      cell: ({ row }) => {
        const product = row.original as ProductPriceListResponse;
        const priceInfo = product.prices;

        // Render nothing if there is no price information at all
        if (!priceInfo) {
          return null;
        }

        return (
          <EditablePriceCell
            initialValue={priceInfo.price}
            productId={priceInfo.id?.toString() || ''}
            onPriceChange={handlePriceChange}
            onKeyDown={(e) => handleKeyDown(e, priceInfo.id?.toString() || '')}
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
          </CardHeader>
          <CardContent>
            {/* Added search input and select for searchBy */}
            <div className="flex items-center justify-between gap-2 mb-4">
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
                <SortDropdown
                  sortableColumns={sortableColumns}
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                />
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
            />
          </CardContent>
        </Card>
      </div>
      {priceChangeToConfirm && (
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Xác nhận thay đổi giá"
          description={`Bạn có chắc chắn muốn cập nhật giá cho sản phẩm "${priceChangeToConfirm.productCode}" thành ${priceChangeToConfirm.newPrice.toLocaleString()}?`}
          onConfirm={handleConfirmUpdate}
          confirmText={isUpdating ? 'Đang cập nhật...' : 'Xác nhận'}
          cancelText="Hủy"
        />
      )}
    </div>
  );
}
