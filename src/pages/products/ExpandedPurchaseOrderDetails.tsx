import { usePurchaseOrderDetails } from "@/apis/hooks/purchase";
import { Loader2 } from "lucide-react";

interface ExpandedPurchaseOrderDetailsProps {
  purchaseOrderId: number;
}

export default function ExpandedPurchaseOrderDetails({ purchaseOrderId }: ExpandedPurchaseOrderDetailsProps) {
  const {
    data: purchaseOrderDetailsData,
    isLoading: purchaseOrderDetailsLoading,
    error: purchaseOrderDetailsError,
  } = usePurchaseOrderDetails(purchaseOrderId);

  const details = purchaseOrderDetailsData;

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

  //TODO: Implement this
  return <div>ExpandedPurchaseOrderDetails</div>;
}