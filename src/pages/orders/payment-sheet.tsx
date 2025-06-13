import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useForm, Controller } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import MedicineInfo from './medicine-info';
import { ProductResponse } from '@/apis/types/product';
import { useCreateOrder } from '@/apis/hooks/sales'; // Import the hook
import { useToast } from '@/hooks/use-toast';
import { CreateOrderItemRequest, CreateOrderRequest, PrescriptionInfoRequest } from '@/apis/types/sales';

interface CartItem extends ProductResponse {
  quantity: number;
}

interface CustomerResponse {
  id: number;
  name?: string | null;
}

interface PaymentSheetProps {
  selectedCustomer: CustomerResponse | null;
  currentSelectedProducts: CartItem[];
  totalAmount: number;
  onOrderSuccess: () => void;
}

interface PaymentFormValues {
  prescriptionSale: boolean;
  paymentMethod: string;
  // Add field for prescription info
  prescriptionInfo?: PrescriptionInfoRequest;
}

export function PaymentSheet({
  selectedCustomer,
  currentSelectedProducts,
  totalAmount,
  onOrderSuccess,
}: PaymentSheetProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const methods = useForm<PaymentFormValues>({
    defaultValues: {
      prescriptionSale: false,
      paymentMethod: 'cash',
      prescriptionInfo: undefined, // Initialize prescription info
    },
  });

  const createOrderMutation = useCreateOrder(); // Instantiate the mutation hook

  const onSubmit = (data: PaymentFormValues) => {
    // Map cart items to API format
    const orderItems: CreateOrderItemRequest[] = currentSelectedProducts.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.defaultPrice?.purchasePrice || 0, // Assuming item.price is the unit price
      totalPrice: (item.defaultPrice?.purchasePrice ?? 0) * item.quantity,
      discountAmount: 0, // Assuming no discounts for now
      discountPercent: 0, // Assuming no discounts for now
      finalPrice: (item.defaultPrice?.purchasePrice ?? 0) * item.quantity, // Assuming no discounts
      measurementUnitId: item.defaultPrice?.measurementUnitId,
      // batchId and measurementUnitId are optional based on API types, skipping for now
      // If they become required, the CartItem structure or product selection flow needs adjustment
    }));

    // Map payment method string to API enum
    const paymentMethodMapping: Record<string, CreateOrderRequest['paymentMethod']> = {
      cash: 'CASH',
      transfer: 'BANK_TRANSFER',
      card: 'CREDIT_CARD',
      wallet: 'MOBILE_PAYMENT',
    };
    const apiPaymentMethod = paymentMethodMapping[data.paymentMethod] || 'OTHER'; // Default to OTHER if unknown

    // Construct the API request payload
    const createOrderRequest: CreateOrderRequest = {
      customerId: selectedCustomer?.id,
      storeId: 1, // Assuming storeId is handled by backend or not required in request
      items: orderItems,
      note: undefined, // Add a note field if needed in the form
      paymentMethod: apiPaymentMethod,
      totalAmount: totalAmount, // Total amount before discount
      amountPaid: totalAmount, // Assuming customer pays the total amount
      changeGiven: 0, // Assuming no change given
      discountAmount: 0, // Total discount amount for the order
      finalAmount: totalAmount, // Final amount after discount

      // Include prescription info only if prescriptionSale is checked and info is available
      prescriptionInfo: data.prescriptionSale ? data.prescriptionInfo : undefined,
    };

    console.log('Create Order Request:', createOrderRequest);

    // Call the mutation
    createOrderMutation.mutate(createOrderRequest, {
      onSuccess: () => {
        toast({
          title: 'Thanh toán thành công',
          description: `Đơn hàng đã được ghi nhận.`,
        });
        setOpen(false); // Close the sheet
        onOrderSuccess();
      },
      onError: (error) => {
        toast({
          title: 'Thanh toán thất bại',
          description: error.message || 'Đã xảy ra lỗi',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-2.5 dark:bg-blue-700 dark:hover:bg-blue-800"
          variant="outline"
        >
          Thanh toán
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-screen md:max-w-xl rounded-t-xl">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-medium">{selectedCustomer?.name || 'Khách lẻ'}</SheetTitle>
        </SheetHeader>
        <Form {...methods}>
          <form id="payment-form" onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col space-y-6 pb-6">
            {/* Prescription checkbox */}
            <Controller
              name="prescriptionSale"
              control={methods.control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox id="prescription" checked={field.value} onCheckedChange={field.onChange} />
                  <MedicineInfo onSave={(data) => methods.setValue('prescriptionInfo', data)} />
                </div>
              )}
            />

            {/* Order summary */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng tiền hàng</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">{currentSelectedProducts.length}</span>
                  <span className="text-sm font-medium">{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Giảm giá</span>
                <span className="text-sm">0</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Khách cần trả</span>
                <span className="text-lg font-semibold text-blue-600">{totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Khách thanh toán</span>
                <span className="text-sm font-medium">{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="space-y-4">
              <Controller
                name="paymentMethod"
                control={methods.control}
                render={({ field }) => (
                  <RadioGroup className="flex gap-4 justify-between" onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="text-sm">
                        Tiền mặt
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="text-sm">
                        Chuyển khoản
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="text-sm">
                        Thẻ
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="text-sm">
                        Ví
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          </form>
        </Form>

        {/* Payment button */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            type="submit"
            form="payment-form"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
          >
            THANH TOÁN
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
