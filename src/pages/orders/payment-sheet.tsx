import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function PaymentSheet() {
  const [prescriptionSale, setPrescriptionSale] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

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
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
          <SheetTitle className="text-lg font-medium">Khách lẻ</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-6 pb-6">
          {/* Prescription checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="prescription" checked={prescriptionSale} onCheckedChange={setPrescriptionSale} />
            <Label htmlFor="prescription" className="text-sm">
              Bán thuốc theo đơn
            </Label>
          </div>

          {/* Order summary */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tổng tiền hàng</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm">2</span>
                <span className="text-sm font-medium">530,000</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Giảm giá</span>
              <span className="text-sm">0</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Khách cần trả</span>
              <span className="text-lg font-semibold text-blue-600">530,000</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Khách thanh toán</span>
              <span className="text-sm font-medium">530,000</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
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

            {/* Bank account notice */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>Bạn chưa có tài khoản ngân hàng</p>
              <button className="text-blue-600 underline">+ Thêm tài khoản</button>
            </div>
          </div>
        </div>

        {/* Payment button */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium">
            THANH TOÁN
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
