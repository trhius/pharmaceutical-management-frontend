import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [gender, setGender] = useState("male")

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Open Medicine Form</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-medium">Thông tin đơn thuốc</DialogTitle>
          </DialogHeader>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicine-code" className="text-sm font-medium">
                    Mã đơn thuốc
                  </Label>
                  <Input id="medicine-code" placeholder="" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor" className="text-sm font-medium">
                    Bác sĩ kê đơn
                  </Label>
                  <Input id="doctor" placeholder="" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facility" className="text-sm font-medium">
                    Cơ sở khám bệnh
                  </Label>
                  <Input id="facility" placeholder="" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-name" className="text-sm font-medium">
                    Tên bệnh nhân
                  </Label>
                  <Input id="patient-name" placeholder="" />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tuổi</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-sm">
                        Nam
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-sm">
                        Nữ
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium">
                    Cân nặng
                  </Label>
                  <Input id="weight" placeholder="" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id-card" className="text-sm font-medium">
                    CMTND/Căn cước
                  </Label>
                  <Input id="id-card" placeholder="" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance-card" className="text-sm font-medium">
                    Thẻ BHYT
                  </Label>
                  <Input id="insurance-card" placeholder="" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <Input id="address" placeholder="" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardian" className="text-sm font-medium">
                    Người giám hộ
                  </Label>
                  <Input id="guardian" placeholder="" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Điện thoại liên hệ
                  </Label>
                  <Input id="phone" placeholder="" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis" className="text-sm font-medium">
                    Chẩn đoán
                  </Label>
                  <Input id="diagnosis" placeholder="" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Bỏ qua
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Xong
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
