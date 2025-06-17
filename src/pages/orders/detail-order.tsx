import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useOrderDetails } from '@/apis/hooks/sales';
import { Loader2, Trash2, Edit3 } from 'lucide-react';
import { orderStatusMap } from '@/apis/types/transform';

interface Props {
  orderId: number;
}

export default function DetailOrder({ orderId }: Props) {
  const { data: orderDetails, isLoading, isError } = useOrderDetails(orderId, { enabled: !!orderId });

  const formatCurrency = (amount: number | string | undefined) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numericAmount as number)) return '0';
    return (numericAmount as number).toString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Đang tải chi tiết đơn hàng...</span>
      </div>
    );
  }

  if (isError || !orderDetails) {
    return <div className="p-4 text-center text-destructive">Không thể tải chi tiết đơn hàng.</div>;
  }

  const totalQuantity = orderDetails.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const statusInfo = orderStatusMap[orderDetails.status || 'NEW'] || { label: 'Không xác định', variant: 'default' };

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center gap-4">
        <p className="font-bold text-lg">{orderDetails.code}</p>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Khách hàng</p>
          <p className="text-sm font-medium">{orderDetails.customerName ? orderDetails.customerName : 'Khách lẻ'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Người tạo</p>
          <p className="text-sm font-medium">{orderDetails.createdBy}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Ngày tạo</p>
          <p className="text-sm font-medium">{orderDetails.createdAt ? format(new Date(orderDetails.createdAt), 'dd/MM/yyyy HH:mm') : '-'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Chi nhánh</p>
          <p className="text-sm font-medium">{orderDetails.storeName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Mã hàng</TableHead>
                  <TableHead>Tên hàng</TableHead>
                  <TableHead className="text-center">Số lượng</TableHead>
                  <TableHead className="text-right">Giá bán</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.orderItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productCode}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.totalAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4 mt-4">
        <div className="w-1/2 space-y-1">
          <label htmlFor="notes" className="text-sm font-medium">Ghi chú</label>
          <Textarea id="notes" value={orderDetails.note || ''} readOnly disabled className="w-full resize-none" rows={2} />
        </div>
        <div className="w-1/3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tổng tiền hàng ({totalQuantity})</span>
            <span className="font-medium">{formatCurrency(orderDetails.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá</span>
            <span className="font-medium">{formatCurrency(orderDetails.discountAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Khách đã trả</span>
            <span>{formatCurrency(orderDetails.finalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="space-x-2">
          {orderDetails.status === 'NEW' && (
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Hủy
            </Button>
          )}
          {orderDetails.status === 'NEW' && (
            <Button variant="outline">
              <Edit3 className="w-4 h-4 mr-2" /> Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
