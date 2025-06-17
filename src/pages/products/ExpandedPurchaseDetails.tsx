import { useCancelPurchaseOrder, usePurchaseOrderDetails } from "@/apis/hooks/purchase";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PurchaseDetailsResponse, PurchaseOrderStatus } from '@/apis/types/purchase';
import { format } from 'date-fns';
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useNavigate } from "react-router-dom";
import { purchase } from "@/apis/services/purchase";

interface ExpandedPurchaseOrderDetailsProps {
  purchaseOrderId: number;
}

export default function ExpandedPurchaseOrderDetails({ purchaseOrderId }: ExpandedPurchaseOrderDetailsProps) {
  const {
    data: purchaseOrderDetailsData,
    isLoading: purchaseOrderDetailsLoading,
    error: purchaseOrderDetailsError,
    refetch: refetchDetails,
  } = usePurchaseOrderDetails(purchaseOrderId);
  
  const details = purchaseOrderDetailsData;
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cancelPurchaseOrderMutation = useCancelPurchaseOrder();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseDetailsResponse | null>(null);

  const handleEdit = async (purchaseOrder: PurchaseDetailsResponse) => {
    if (!purchaseOrder.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy phiếu nhập.",
        variant: "destructive",
      });
      return;
    }
    try {
      const previewData = await purchase.getPurchaseOrderPreview(purchaseOrder.id);
      navigate('/products/purchase-order/import', { state: { previewData, purchaseOrderId: purchaseOrder.id } });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lấy thông tin phiếu nhập.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (purchaseOrder: PurchaseDetailsResponse) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedPurchaseOrder?.id) return;
    cancelPurchaseOrderMutation.mutate(selectedPurchaseOrder.id, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Huỷ phiếu tạm thành công",
        });
        setIsDeleteDialogOpen(false);
        refetchDetails();
        queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      },
      onError: (error) => {
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi huỷ phiếu: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  if (purchaseOrderDetailsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4">
        <Loader2 className="animate-spin" />
        <span>Đang tải chi tiết phiếu nhập hàng...</span>
      </div>
    );
  }

  if (purchaseOrderDetailsError) {
    return <div className="p-4 text-red-500">Lỗi khi tải chi tiết phiếu nhập hàng.</div>;
  }

  if (!details) {
    return <div className="p-4 text-gray-500">Không có thông tin chi tiết.</div>;
  }

  const statusText: Record<PurchaseOrderStatus, string> = {
    DRAFT: 'Phiếu tạm',
    CONFIRMED: 'Đã nhập hàng',
    CANCELLED: 'Đã hủy',
  };
  const variant: Record<PurchaseOrderStatus, 'default' | 'secondary' | 'destructive' | 'success'> = {
    DRAFT: 'secondary',
    CONFIRMED: 'success',
    CANCELLED: 'destructive',
  };

  return (
    <div className="space-y-4">
      <div className="w-full rounded-md space-y-4 p-2">
        <div className="flex items-center gap-4">
          <p className="font-bold text-lg">{details.code}</p>
          {details.status && (
            <Badge variant={variant[details.status as PurchaseOrderStatus]}>
              {statusText[details.status as PurchaseOrderStatus]}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Row 1 */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Người tạo</p>
            <p className="text-sm font-medium">{details.createdBy}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">Ngày tạo</p>
            <p className="text-sm font-medium">{details.createdAt ? format(new Date(details.createdAt), 'dd/MM/yyyy HH:mm') : '-'}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">Chi nhánh</p>
            <p className="text-sm font-medium">{details.storeName}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">Nhà cung cấp</p>
            <p className="text-sm font-medium">{details.supplierName}</p>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="px-4 py-2 text-left font-semibold">Mã hàng</th>
                    <th className="px-4 py-2 text-left font-semibold">Tên hàng</th>
                    <th className="px-4 py-2 text-left font-semibold">Đơn vị</th>
                    <th className="px-4 py-2 text-left font-semibold">Số lượng</th>
                    <th className="px-4 py-2 text-left font-semibold">Đơn giá</th>
                    <th className="px-4 py-2 text-right font-semibold">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {details.purchaseItems?.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 p-2">{item.productCode}</td>
                      <td className="px-4 p-2">
                        <div>{item.productName}</div>
                        <div className="text-xs text-gray-500">
                          {item.batchNumber} - {item.expirationDate ? format(new Date(item.expirationDate), 'dd/MM/yyyy') : ''}
                        </div>
                      </td>
                      <td className="px-4 p-2">{item.measurementUnitName}</td>
                      <td className="px-4 p-2">{item.quantity}</td>
                      <td className="px-4 p-2">{item.unitPrice?.toLocaleString()}</td>
                      <td className="px-4 p-2 text-right">{item.totalPrice?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between gap-4 mt-4">
          <div className="w-1/2 space-y-1">
            <label htmlFor="notes" className="text-sm font-medium">Ghi chú</label>
            <Textarea
              id="notes"
              value={details.note || ''}
              readOnly
              disabled
              className="w-full resize-none"
              rows={2}
            />
          </div>
          <div className="w-1/3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-sm">Số lượng mặt hàng</span>
              <span className="font-medium">{details.totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Tổng tiền hàng ({details.totalQuantity || 0})</span>
              <span className="font-medium">{details.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Giảm giá</span>
              <span className="font-medium">{details.discount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Tổng cộng</span>
              <span>{details.finalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="space-x-2">
            {details.status === 'DRAFT' && (
              <Button variant="destructive" onClick={() => handleDelete(details)}>
                Huỷ phiếu
              </Button>
            )}
            {details.status === 'DRAFT' && (
              <Button variant="outline" onClick={() => handleEdit(details)}>
                Mở phiếu
              </Button>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận huỷ phiếu"
        description="Bạn có chắc chắn muốn huỷ phiếu tạm này không?"
        onConfirm={handleConfirmCancel}
        confirmText="Xác nhận"
        cancelText="Huỷ"
      />
    </div>
  );
}