import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useForm, Controller } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import MedicineInfo from './medicine-info';

// Define simple types for props based on usage in create.tsx
interface CartItem {
  id: string;
  productName?: string;
  imageUrl?: string;
  defaultPrice?: {
    purchasePrice?: number;
  };
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
}

interface PaymentFormValues {
  prescriptionSale: boolean;
  paymentMethod: string;
}

export function PaymentSheet({ selectedCustomer, currentSelectedProducts, totalAmount }: PaymentSheetProps) {
  const methods = useForm<PaymentFormValues>({
    defaultValues: {
      prescriptionSale: false,
      paymentMethod: 'cash',
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    console.log('Payment Form Data:', data);
    console.log('Selected Customer:', selectedCustomer);
    console.log('Selected Products:', currentSelectedProducts);
    console.log('Total Amount:', totalAmount);
    // TODO: Implement payment logic
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 dark:bg-blue-700 dark:hover:bg-blue-800"
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
                  <MedicineInfo onSave={console.log} />
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
