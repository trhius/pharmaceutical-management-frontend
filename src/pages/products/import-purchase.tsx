import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UploadIcon, Trash2, Loader2, PlusIcon } from 'lucide-react';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  PurchasePreviewResponse,
  PurchasePreviewItemResponse,
  PurchaseImportRequest,
  PurchasePreviewErrorResponse,
} from '@/apis/types/purchase';
import { usePreviewPurchaseOrder, useImportPurchaseOrder } from '@/apis/hooks/purchase';
import { useSuppliers } from '@/apis/hooks/supplier';
import { SupplierResponse } from '@/apis/types/supplier';
import { Combobox } from '@/components/ui/combobox';
import { AddProviderDialog } from '@/pages/providers/add-provider-dialog';
import { useQueryClient } from '@tanstack/react-query';

export default function ImportPurchasePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [purchaseOrderId, setPurchaseOrderId] = useState<number | null>(null);
  const [items, setItems] = useState<PurchasePreviewItemResponse[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierResponse | null>(null);
  const [note, setNote] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers({
    request: {},
    page: 0,
    size: 1000,
    sortBy: 'NAME',
    sortOrder: 'ASC',
  });
  const importMutation = useImportPurchaseOrder();
  const previewMutation = usePreviewPurchaseOrder();

  useEffect(() => {
    const { previewData, purchaseOrderId: pId } = location.state || {};
    if (previewData) {
      setItems(previewData.items || []);
      
      if (previewData.supplierId && previewData.supplierName) {
        const supplierFromList = suppliersData?.content?.find(s => s.id === previewData.supplierId);
        if (supplierFromList) {
          setSelectedSupplier(supplierFromList);
        } else {
          setSelectedSupplier({ id: previewData.supplierId, name: previewData.supplierName } as SupplierResponse);
        }
      }
      
      setNote(previewData.note || '');
      setDiscount(previewData.discount || 0);
      if (pId) {
        setPurchaseOrderId(pId);
      }
    }
  }, [location.state, suppliersData]);

  const supplierOptions = useMemo(() => {
    if (isLoadingSuppliers || !suppliersData?.content) {
      return selectedSupplier ? [{ value: selectedSupplier.id!.toString(), label: selectedSupplier.name! }] : [];
    }
    
    const options = suppliersData.content.map((s) => ({
      value: s.id!.toString(),
      label: s.name!,
    }));

    if (selectedSupplier && !suppliersData.content.some(s => s.id === selectedSupplier.id)) {
      options.unshift({ value: selectedSupplier.id!.toString(), label: selectedSupplier.name! });
    }
    
    return options;
  }, [suppliersData, selectedSupplier, isLoadingSuppliers]);

  const handleItemChange = (index: number, field: 'quantity' | 'unitPrice', value: string) => {
    const newItems = [...items];
    const item = newItems[index];
    if (item) {
        const numericValue = parseFloat(value) || 0;
        if (field === 'quantity') {
            item.quantity = numericValue;
        } else if (field === 'unitPrice') {
            item.unitPrice = numericValue;
        }
        item.totalPrice = (item.quantity || 0) * (item.unitPrice || 0);
        setItems(newItems);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [items]);

  const finalAmount = useMemo(() => totalAmount - discount, [totalAmount, discount]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      previewMutation.mutate(file, {
        onSuccess: (data) => {
          if ('errors' in data) {
            toast({
              title: 'Lỗi từ file Excel',
              description: (data as PurchasePreviewErrorResponse).errors?.join('. ') || 'Vui lòng kiểm tra lại file.',
              variant: 'destructive',
              duration: 2000,
            });
          } else {
            const preview = data as PurchasePreviewResponse;
            setItems(preview.items || []);
            
            if (preview.supplierId && preview.supplierName) {
              setSelectedSupplier({
                id: preview.supplierId,
                name: preview.supplierName,
              } as SupplierResponse);
            } else {
              setSelectedSupplier(null);
            }
            
            setNote(preview.note || '');
            setDiscount(preview.discount || 0);
            setPurchaseOrderId(null);

            toast({
              title: 'Thành công',
              description: 'Dữ liệu từ file đã được tải lên.',
              duration: 2000,
            });
          }
        },
        onError: (error) => {
          toast({
            title: 'Lỗi hệ thống',
            description: error.message,
            variant: 'destructive',
            duration: 2000,
          });
        },
      });
    }
  };

  const handleTriggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = (status: 'DRAFT' | 'CONFIRMED') => {
    if (!selectedSupplier) {
        toast({ title: "Lỗi", description: "Vui lòng chọn nhà cung cấp", variant: "destructive" });
        return;
    }
    if (items.length === 0) {
        toast({ title: "Lỗi", description: "Không có sản phẩm nào để nhập", variant: "destructive" });
        return;
    }

    const importItems = items.map(item => ({
        productCode: item.productCode!,
        quantity: item.quantity!,
        unitPrice: item.unitPrice!,
        totalPrice: item.totalPrice!,
        batchNumber: item.batchNumber,
        expirationDate: item.expirationDate,
    }));

    const payload: PurchaseImportRequest = {
        id: purchaseOrderId || undefined,
        supplierId: selectedSupplier.id!,
        note,
        discount,
        status,
        items: importItems,
        totalAmount: totalAmount,
        finalAmount: finalAmount,
    };

    importMutation.mutate(payload, {
        onSuccess: () => {
            const successMessage = purchaseOrderId
              ? "Cập nhật phiếu nhập thành công."
              : "Tạo phiếu nhập hàng thành công.";
            toast({ title: "Thành công", description: successMessage });
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
            navigate('/products/purchase-order');
        },
        onError: (error) => {
            toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        }
    });
  };

  const renderInitialState = () => (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-6 text-center">
        <p className="text-gray-500 mb-2">Thêm sản phẩm từ file excel</p>
        <p className="text-xs text-gray-400 mb-4">
        (Tải về file mẫu <a href="/templates/MauFileNhapHang.xlsx" download className="text-blue-500 hover:underline">Excel file</a>)
        </p>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".xlsx, .xls"
        />
        <Button onClick={handleTriggerFileUpload} disabled={previewMutation.isPending}>
            {previewMutation.isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                </>
            ) : (
                <>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Chọn file dữ liệu
                </>
            )}
        </Button>
    </div>
  );

  const renderItemsTable = () => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b">
                    <th className="p-2 text-left font-semibold">STT</th>
                    <th className="p-2 text-left font-semibold">Mã hàng</th>
                    <th className="p-2 text-left font-semibold w-2/7">Tên hàng</th>
                    <th className="p-2 text-left font-semibold">Đơn vị</th>
                    <th className="p-2 text-left font-semibold">Số lượng</th>
                    <th className="p-2 text-left font-semibold">Đơn giá</th>
                    <th className="p-2 text-left font-semibold">Thành tiền</th>
                    <th className="p-2 text-right font-semibold"></th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr key={index} className="border-b">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{item.productCode}</td>
                        <td className="p-2">{item.productName}</td>
                        <td className="p-2">{item.measurementUnitName}</td>
                        <td className="p-2">
                            <Input
                                type="number"
                                value={item.quantity || ''}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                className="w-12 h-8"
                            />
                        </td>
                        <td className="p-2">
                             <Input
                                type="number"
                                value={item.unitPrice || ''}
                                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                className="w-24 h-8"
                            />
                        </td>
                        <td className="p-2">{(item.totalPrice || 0).toLocaleString()}</td>
                        <td className="p-2 text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/products/purchase-order">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{purchaseOrderId ? 'Cập nhật phiếu nhập' : 'Tạo nhập hàng'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? renderInitialState() : renderItemsTable()}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phiếu nhập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nhà cung cấp</label>
                <div className="flex items-center gap-2">
                  <div className="flex-grow">
                    <Combobox
                      options={supplierOptions}
                      value={selectedSupplier?.id?.toString()}
                      onChange={(value) => {
                        const supplier =
                          suppliersData?.content?.find((s) => s.id?.toString() === value) || null;
                        setSelectedSupplier(supplier);
                      }}
                      placeholder="Chọn nhà cung cấp"
                      searchPlaceholder="Tìm nhà cung cấp..."
                      emptyText="Không tìm thấy nhà cung cấp."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsAddSupplierOpen(true)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <Input disabled value="Phiếu tạm" />
              </div>
              <div>
                <label className="text-sm font-medium">Ghi chú</label>
                <Textarea
                  placeholder="Thêm ghi chú..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tổng tiền hàng ({totalQuantity})</span>
                <span>{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <label>Giảm giá</label>
                <Input 
                    type="number" 
                    className="w-28 h-8 text-right" 
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Cần trả nhà cung cấp</span>
                <span>{finalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button 
            variant="outline" 
            onClick={() => handleSave('DRAFT')}
            disabled={importMutation.isPending}
        >
            {importMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            Lưu tạm
        </Button>
        <Button 
            onClick={() => handleSave('CONFIRMED')}
            disabled={importMutation.isPending}
        >
            {importMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            Hoàn thành
        </Button>
      </div>
      <AddProviderDialog
        open={isAddSupplierOpen}
        onOpenChange={setIsAddSupplierOpen}
        onProviderAdded={() => {
          queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        }}
      />
    </div>
  );
} 