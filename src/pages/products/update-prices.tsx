import { useState, useCallback } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { TableFilterSidebar } from './filter-product-price';
import { useProductPrices } from '@/apis/hooks/product';
import { GetProductPriceRequest } from '@/apis/types/product';

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
  const { data: productsData, isLoading } = useProductPrices(filter);
  const products = productsData?.content;

  const onFilter = useCallback((values: GetProductPriceRequest) => {
    setFilter((prev) => ({ ...prev, request: values }));
  }, []);

  // Define columns for the DataTable
  const columns = [
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
      header: 'Giá bán',
    },
    {
      accessorKey: 'prices.price',
      header: 'Giá vốn',
    },
  ];

  return (
    <div className="mx-auto py-6 space-y-4">
      <PageHeader
        title="Sản phẩm"
        description="Quản lý danh mục sản phẩm"
      />

      <div className="flex min-h-screen items-start gap-8 py-8">
        <div className="sticky top-8">
          <TableFilterSidebar onFilter={onFilter} />
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>Xem và quản lý thông tin chi tiết sản phẩm.</CardDescription>
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
