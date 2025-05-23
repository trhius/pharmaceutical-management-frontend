import { useState, useCallback } from 'react';
import { PlusIcon } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { TableFilterSidebar } from './filter-product';
import { useProducts } from '@/apis/hooks/product';
import { GetProductRequest, ProductResponse } from '@/apis/types/product';
import { Badge } from '@/components/ui/badge';

export default function ProductsListPage() {
  const [filter, setFilter] = useState<GetProductRequest>({});
  const { data: productsData, isLoading } = useProducts({ request: filter });
  const products = productsData?.content;

  const onFilter = useCallback((values: GetProductRequest) => {
    setFilter(values);
  }, []);

  // Define columns for the DataTable
  const columns = [
    {
      accessorKey: 'productCode',
      header: 'Mã sản phẩm',
    },
    {
      accessorKey: 'name',
      header: 'Tên sản phẩm',
    },
    {
      accessorKey: 'dosageForm',
      header: 'Tên viết tắt',
    },
    {
      accessorKey: 'brand',
      header: 'Nhãn hiệu',
    },
    {
      accessorKey: 'type',
      header: 'Loại',
      cell: ({ row }: any) => {
        const type = row.original.type;
        return (
          <Badge variant={type === 'DRUG' ? 'default' : 'secondary'}>
            {type === 'DRUG' ? 'Thuốc' : 'Thực phẩm chức năng'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Trạng thái',
      cell: ({ row }: any) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
          </Badge>
        );
      },
    },
    // Add more columns as needed based on ProductResponse
  ];

  // Function to render expanded content for a row (if needed)
  const renderExpandedContent = (product: ProductResponse) => {
    return (
      <div className="space-y-4 p-4">
        <h4 className="text-lg font-semibold">Chi tiết sản phẩm</h4>
        {/* Display more product details here */}
        <p>
          <span className="font-medium">Thành phần:</span> {product.ingredients || 'N/A'}
        </p>
        <p>
          <span className="font-medium">Dạng bào chế:</span> {product.dosageForm || 'N/A'}
        </p>
        <p>
          <span className="font-medium">Quy cách đóng gói:</span> {product.specification || 'N/A'}
        </p>
        {/* Add other relevant fields from ProductResponse */}
      </div>
    );
  };

  return (
    <div className="mx-auto py-6 space-y-4">
      <PageHeader
        title="Sản phẩm"
        description="Quản lý danh mục sản phẩm"
        actions={
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        }
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
              expandedContent={renderExpandedContent}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
