import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Trash2, Edit3, Save } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useOrderDetails } from '@/apis/hooks/sales'; // Import the useOrderDetails hook
import { Loader2 } from 'lucide-react'; // Import Loader2 for loading indicator
import { orderStatusMap } from '@/apis/types/transform'; // Assuming this map exists for status display

interface Props {
  orderId: number; // Change prop type to number
}

export default function DetailOrder({ orderId }: Props) {
  // Fetch order details using the hook
  const { data: orderDetails, isLoading, isError } = useOrderDetails(orderId, { enabled: !!orderId });

  // Derived values from orderDetails
  const subtotal =
    orderDetails?.orderItems?.reduce((sum, item) => sum + (parseFloat(item.totalAmount || '0') || 0), 0) || 0;
  const totalDiscount = parseFloat(orderDetails?.discountAmount || '0') || 0;
  const customerPayable = parseFloat(orderDetails?.finalAmount || '0') || 0;
  const customerPaid = parseFloat(orderDetails?.amountPaid || '0') || 0;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !orderDetails) {
    return <div className="text-center text-red-500">Không thể tải chi tiết đơn hàng.</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="prescription">Đơn thuốc</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          {/* Patient Information Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{orderDetails.customerName}</h2>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{orderDetails.code}</span>
                  <Badge variant="secondary" className={`${orderStatusMap[orderDetails.status || 'NEW'].color}`}>
                    {orderStatusMap[orderDetails.status || 'NEW'].label}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{orderDetails.storeName}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creator">Người tạo:</Label>
                  <Input id="creator" value={orderDetails.createdBy || 'N/A'} readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller">Người bán:</Label>
                  <Input id="seller" value={orderDetails.soldBy || 'N/A'} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>Ngày bán:</Label>
                  <Input
                    value={
                      orderDetails.createdAt
                        ? format(new Date(orderDetails.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                        : 'N/A'
                    }
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medications Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-zinc-800">
                  <TableRow>
                    <TableHead>Mã hàng</TableHead>
                    <TableHead>Tên hàng</TableHead>
                    <TableHead className="text-center">Số lượng</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Giảm giá</TableHead>
                    <TableHead className="text-right">Giá bán</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.orderItems?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className="text-blue-600 font-medium">{item.productCode}</span>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm">{item.productName}</div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(parseFloat(item.price || '0'))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(parseFloat(item.discount || '0'))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(parseFloat(item.price || '0'))}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(parseFloat(item.totalAmount || '0'))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Tổng tiền hàng (12)</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Giảm giá hóa đơn</span>
                  <span className="font-medium">{formatCurrency(totalDiscount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Khách cần trả</span>
                  <span className="font-medium">{formatCurrency(customerPayable)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>Khách đã trả</span>
                  <span>{formatCurrency(customerPaid)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú...</Label>
                <Textarea
                  id="notes"
                  placeholder="Nhập ghi chú..."
                  value={orderDetails.note || ''}
                  className="min-h-[80px]"
                  readOnly // Make it read-only for now, can be made editable with an edit mode
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Hủy
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa
              </Button>
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Lưu
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prescription">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Nội dung đơn thuốc sẽ được hiển thị ở đây.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
