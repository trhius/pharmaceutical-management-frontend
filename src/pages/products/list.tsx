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
  const [filter, setFilter] = useState<GetProductRequest>({
    page: 0,
    size: 10,
  });
  const { data: productsData, isLoading } = useProducts(filter);
  const products = productsData?.content;

  const onFilter = useCallback((values: GetProductRequest) => {
    console.log(values);
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
      accessorKey: 'shortenName',
      header: 'Tên viết tắt',
    },
    {
      accessorKey: 'defaultPrice.purchasePrice',
      header: 'Giá bán',
    },
    {
      accessorKey: 'defaultPrice.price',
      header: 'Giá vốn',
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
      <div className="space-y-4">
        <div className="w-full rounded-md space-y-4 p-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Row 1 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mã hàng</p>
              <p className="text-sm font-medium">{product.productCode}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Mã vạch</p>
              <p className="text-sm font-medium"></p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Tên viết tắt</p>
              <p className="text-sm font-medium">{product.shortenName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Định mức tồn</p>
              <p className="text-sm font-medium"></p>
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Giá vốn</p>
              <p className="text-sm font-medium">{product.defaultPrice?.price}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Giá bán</p>
              <p className="text-sm font-medium">{product.defaultPrice?.purchasePrice}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Vị trí</p>
              <p className="text-sm font-medium"></p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Trọng lượng</p>
              <p className="text-sm font-medium"></p>
            </div>
          </div>

          {/* Row 3 */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Mã thuốc</p>
                  <p className="text-sm font-medium"></p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Số đăng ký</p>
                  <p className="text-sm font-medium"></p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Hoạt chất</p>
                  <p className="text-sm font-medium"></p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Hàm lượng</p>
                  <p className="text-sm font-medium"></p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Đường dùng</p>
                  <p className="text-sm font-medium"></p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Quy cách đóng gói</p>
                  <p className="text-sm font-medium"></p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Hãng sản xuất</p>
                  <p className="text-sm font-medium"></p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Nước sản xuất</p>
                  <p className="text-sm font-medium"></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <div className="flex justify-end"> */}
        {/*   <div className="space-x-2"> */}
        {/*     <Button variant="outline" onClick={() => handleEdit(employee)}> */}
        {/*       Cập nhật thông tin */}
        {/*     </Button> */}
        {/*     {employee.status === 'ACTIVE' && ( */}
        {/*       <Button variant="destructive" onClick={() => handleDelete(employee)}> */}
        {/*         Vô hiệu hóa */}
        {/*       </Button> */}
        {/*     )} */}
        {/*   </div> */}
        {/* </div> */}
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
