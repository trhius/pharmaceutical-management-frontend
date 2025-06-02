import { PlusIcon, FileOutput } from 'lucide-react'; // Import ListOrdered icon

import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast'; // Import useToast

import { TableFilterSidebar } from './filter-product';
import { useProducts, useExportProducts } from '@/apis/hooks/product';
import { GetProductRequest, ProductResponse } from '@/apis/types/product';
import { Badge } from '@/components/ui/badge';
import useListPageState from '@/hooks/useListPageState'; // Assuming the path to your custom hook
import { SortDropdown } from '@/components/ui/sort-dropdown'; // Import SortDropdown

const searchByOptions = [
  { label: 'Tên sản phẩm', value: 'NAME' },
  { label: 'Mã sản phẩm', value: 'CODE' },
];

const sortableColumns = [
  { value: 'CODE', label: 'Mã sản phẩm' },
  { value: 'NAME', label: 'Tên sản phẩm' },
  { value: 'SHORT_NAME', label: 'Tên viết tắt' },
  { value: 'BRAND', label: 'Nhãn hiệu' },
  { value: 'CREATED_AT', label: 'Ngày tạo' },
  { value: 'STATUS', label: 'Trạng thái' },
  { value: 'PRICE', label: 'Giá vốn' },
  { value: 'PURCHASE_PRICE', label: 'Giá bán' },
];

export default function ProductsListPage() {
  const {
    filter,
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
  } = useListPageState<GetProductRequest>({
    initialPage: 0,
    initialSize: 10,
    initialSearchBy: 'NAME', // Set initial searchBy to 'NAME'
    resetPageIndexOnFilterChange: true,
  });

  const { toast } = useToast(); // Initialize useToast

  const { data: productsData, isLoading } = useProducts({
    page: filter.page,
    size: filter.size,
    request: filter,
    sortBy, // Pass sortBy to the API hook
    sortOrder, // Pass sortOrder to the API hook
  });
  const products = productsData?.content;

  const exportProductsMutation = useExportProducts();

  // The onFilter callback now directly uses setExternalFilters
  const onFilter = (values: Omit<GetProductRequest, 'page' | 'size' | 'search' | 'searchBy'>) => {
    setExternalFilters(values);
  };

  // handleSearch now uses setSearchTerm and setSearchByValue from the hook
  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchByChange = (value: string) => {
    setSearchByValue(value as GetProductRequest['searchBy']);
  };

  const handleExportClick = () => {
    exportProductsMutation.mutate(
      { request: filter as GetProductRequest },
      {
        onSuccess: (blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          // Set the download attribute with a desired filename
          link.setAttribute('download', 'products_export.xlsx'); // You can adjust the filename and extension
          // Append the link to the body and click it programmatically
          document.body.appendChild(link);
          link.click();
          // Clean up by removing the link and revoking the blob URL
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast({
            title: 'Xuất dữ liệu thành công',
            description: 'Tệp dữ liệu sản phẩm đã được tải xuống.',
          });
        },
        onError: (error) => {
          console.error('Export failed:', error);
          toast({
            title: 'Xuất dữ liệu thất bại',
            description: 'Đã xảy ra lỗi khi xuất dữ liệu sản phẩm.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  // Define columns for the DataTable
  const columns = [
    {
      accessorKey: 'productCode',
      header: 'Mã sản phẩm',
    },
    {
      accessorKey: 'productName',
      header: 'Tên sản phẩm',
      cell: ({ row }: { row: { original: ProductResponse } }) => {
        const product = row.original;
        const imageUrl = product.imageUrl || '/placeholder-product.png'; // Use a placeholder if no image
        return (
          <div className="flex items-center gap-2">
            <img src={imageUrl} alt={product.productName} className="h-8 w-8 rounded-md object-cover" />
            <span>{product.productName}</span>
          </div>
        );
      },
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
          <div className="flex gap-4">
            <img src={product.imageUrl} alt={product.productName} className="h-36 w-36 rounded-md object-cover" />
            <div className="flex flex-col gap-1">
              <p className="font-bold text-lg">{product.productName}</p>
              <p>
                <Badge variant={product.type === 'DRUG' ? 'default' : 'secondary'}>
                  {product.type === 'DRUG' ? 'Thuốc' : 'Thực phẩm chức năng'}
                </Badge>
              </p>
            </div>
          </div>
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
      </div>
    );
  };

  return (
    <div className="mx-auto space-y-4">
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
          {/* TableFilterSidebar now receives the setExternalFilters function */}
          <TableFilterSidebar onFilter={onFilter} />
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>Xem và quản lý thông tin chi tiết sản phẩm.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 mb-4">
              {/* Use flex and justify-between */}
              <div className="flex gap-2 w-1/2 min-w-sm">
                {/* Container for search input and select */}
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
                  value={searchTerm} // Bind input value to searchTerm from hook
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
                <Button onClick={handleExportClick} disabled={isLoading || exportProductsMutation.isPending}>
                  <FileOutput className="mr-2 w-4 h-4" />
                  {exportProductsMutation.isPending ? 'Đang xuất...' : 'Xuất dữ liệu'}
                </Button>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={products || []}
              expandedContent={renderExpandedContent}
              isLoading={isLoading}
              pageCount={productsData?.totalPages || 0}
              pageSize={pageSize}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
