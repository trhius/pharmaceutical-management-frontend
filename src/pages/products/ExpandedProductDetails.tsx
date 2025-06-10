import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useProductDetails } from '@/apis/hooks/product';

interface ExpandedProductDetailsProps {
  productId: number;
}

export default function ExpandedProductDetails({ productId }: ExpandedProductDetailsProps) {
  const {
    data: productDetailsData,
    isLoading: productDetailsLoading,
    error: productDetailsError,
  } = useProductDetails(productId);

  // Use productDetailsData if available, otherwise use initial product data
  const details = productDetailsData;

  if (productDetailsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4">
        <Loader2 className="animate-spin" />
        <span>Đang tải chi tiết sản phẩm...</span>
      </div>
    );
  }

  if (productDetailsError) {
    return <div className="p-4 text-red-500">Lỗi khi tải chi tiết sản phẩm.</div>;
  }

  // If productDetailsData is still null/undefined and no error occurred, it means the initial product data is all we have
  if (!details) {
    return <div className="p-4 text-gray-500">Không có thông tin chi tiết.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="w-full rounded-md space-y-4 p-2">
        <div className="flex gap-4">
          <img
            src={details.imageUrl || '/placeholder-product.png'}
            alt={details.productName}
            className="h-36 w-36 rounded-md object-cover"
          />
          <div className="flex flex-col gap-1">
            <p className="font-bold text-lg">{details.productName}</p>
            <div className="flex flex-wrap items-center gap-2">
              {details.categories?.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Row 1 */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Mã hàng</p>
            <p className="text-sm font-medium">{details.productCode}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">Tên viết tắt</p>
            <p className="text-sm font-medium">{details.shortenName}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">Định mức tồn</p>
            <p className="text-sm font-medium">{details.totalQuantity}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">Đã bán</p>
            <p className="text-sm font-medium">{details.soldQuantity}</p>
          </div>

          {/* Row 2 */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Giá vốn</p>
            <p className="text-sm font-medium">{details.prices?.[0]?.price || '-'}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">Giá bán</p>
            <p className="text-sm font-medium">{details.prices?.[0]?.purchasePrice || '-'}</p>{' '}
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
                <p className="text-sm font-medium">{productDetailsData?.productCode || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Mã lô</p>
                <p className="text-sm font-medium">{details.batchNumbers.join(', ') || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Hoạt chất</p>
                <p className="text-sm font-medium">{details.ingredients || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Đường dùng</p>
                <p className="text-sm font-medium">{details.dosageForm || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Quy cách đóng gói</p>
                <p className="text-sm font-medium">{details.specification || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Hãng sản xuất</p>
                <p className="text-sm font-medium">{details.brand || '-'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Nhà cung cấp</p>
                <p className="text-sm font-medium">{details.supplierNames.join(', ') || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
