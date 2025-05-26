import { useState, useCallback, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { EditablePriceCell } from '@/components/products/editable-price-cell';
import { TableFilterSidebar } from './filter-product-price';
import { useProductPrices, useUpdateProductPrice } from '@/apis/hooks/product';
import { GetProductPriceRequest, UpdateProductPriceRequest } from '@/apis/types/product';

interface FilterProduct {
  sortBy?: string;
  sortOrder?: string;
  page: number;
  size: number;
  request: GetProductPriceRequest;
}

export default function ProductsListPrices() {
  const [filter, setFilter] = useState<FilterProduct>({
    page: 0,
    size: 10,
    request: {},
  });
  const [editedPrices, setEditedPrices] = useState<{ [productId: string]: number }>({});
  const { data: productsData, isLoading } = useProductPrices(filter);
  const { mutate: updatePrices, isPending: isUpdating } = useUpdateProductPrice();
  const products = productsData?.content;

  // Clear edited prices when product data changes (e.g., on pagination or filter)
  useEffect(() => {
    setEditedPrices({});
  }, [productsData]);

  const onFilter = useCallback((values: GetProductPriceRequest) => {
    setFilter((prev) => ({ ...prev, request: values }));
  }, []);

  // Handler to update edited prices from the cell component
  const handlePriceChange = useCallback((productId: string, newPrice: number) => {
    setEditedPrices((prev) => ({
      ...prev,
      [productId]: newPrice,
    }));
  }, []);

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
        const initialPrice = product.prices?.purchasePrice;
        const currentPrice =
          editedPrices[product.prices.id] !== undefined ? editedPrices[product.prices.id] : initialPrice;

        return (
          <EditablePriceCell
            initialValue={currentPrice}
            productId={product.prices.id}
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
            <Button
              onClick={() => {
                const pricesToUpdate: UpdateProductPriceRequest = Object.entries(editedPrices).map(
                  ([productId, price]) => ({
                    productId: productId,
                    measurementUnitId: 1,
                    sellingPrice: price,
                  })
                );
                if (pricesToUpdate.length > 0) {
                  updatePrices(pricesToUpdate);
                }
              }}
              disabled={Object.keys(editedPrices).length === 0 || isUpdating}
            >
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật giá bán'}
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={products || []}
              searchKey="name"
              searchPlaceholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
              isLoading={isLoading}
              pageCount={productsData?.totalPages || 0}
              pageSize={filter.size || 10}
              pageIndex={filter.page || 0}
              onPageChange={(newPage) => setFilter((prev) => ({ ...prev, page: newPage }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
