import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PrescriptionInfoRequest } from '@/apis/types/sales'; // Import the interface

interface MedicineInfoProps {
  onSave: (data: PrescriptionInfoRequest) => void;
}

export default function MedicineInfo({ onSave }: MedicineInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Use state fields matching PrescriptionInfoRequest
  const [prescriptionCode, setPrescriptionCode] = useState<string | undefined>(undefined);
  const [doctorName, setDoctorName] = useState<string | undefined>(undefined);
  const [hospitalName, setHospitalName] = useState<string | undefined>(undefined);
  const [patientName, setPatientName] = useState<string | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined); // Changed default to undefined
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | undefined>(undefined); // Use union type
  const [weight, setWeight] = useState<number | undefined>(undefined); // Use number type
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [guardianName, setGuardianName] = useState<string | undefined>(undefined);
  const [contactPhone, setContactPhone] = useState<string | undefined>(undefined);
  const [insuranceCard, setInsuranceCard] = useState<string | undefined>(undefined);
  const [diagnosis, setDiagnosis] = useState<string | undefined>(undefined);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Label htmlFor="prescription" className="text-sm text-gray-500 dark:text-gray-400">
          Bán thuốc theo đơn
        </Label>
      </DialogTrigger>
      <DialogContent className="md:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Thông tin đơn thuốc</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="prescription-code" className="text-sm font-medium">
                  Mã đơn thuốc
                </Label>
                <Input
                  id="prescription-code"
                  placeholder=""
                  value={prescriptionCode || ''}
                  onChange={(e) => setPrescriptionCode(e.target.value || undefined)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor-name" className="text-sm font-medium">
                Bác sĩ kê đơn
              </Label>
              <Input
                id="doctor-name"
                placeholder=""
                value={doctorName || ''}
                onChange={(e) => setDoctorName(e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital-name" className="text-sm font-medium">
                Cơ sở khám bệnh
              </Label>
              <Input
                id="hospital-name"
                placeholder=""
                value={hospitalName || ''}
                onChange={(e) => setHospitalName(e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-name" className="text-sm font-medium">
                Tên bệnh nhân
              </Label>
              <Input
                id="patient-name"
                placeholder=""
                value={patientName || ''}
                onChange={(e) => setPatientName(e.target.value || undefined)}
              />
            </div>

            <div className="flex gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  Tuổi
                </Label>
                {/* Use type="number" for age */}
                <Input
                  id="age"
                  type="number"
                  placeholder=""
                  value={age || ''}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-3 flex flex-col">
                <Label className="text-sm font-medium">Giới tính</Label>
                {/* Update radio group values and state handling */}
                <RadioGroup value={gender} onValueChange={setGender} className="flex h-full items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MALE" id="gender-male" />
                    <Label htmlFor="gender-male" className="text-sm">
                      Nam
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FEMALE" id="gender-female" />
                    <Label htmlFor="gender-female" className="text-sm">
                      Nữ
                    </Label>
                  </div>
                  {/* Add 'OTHER' option if needed in UI, currently matches type */}
                  {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OTHER" id="gender-other" />
                      <Label htmlFor="gender-other" className="text-sm">
                        Khác
                      </Label>
                    </div> */}
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">
                Cân nặng
              </Label>
              {/* Use type="number" for weight */}
              <Input
                id="weight"
                type="number"
                placeholder=""
                value={weight || ''}
                onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="insurance-card" className="text-sm font-medium">
                Thẻ BHYT
              </Label>
              <Input
                id="insurance-card"
                placeholder=""
                value={insuranceCard || ''}
                onChange={(e) => setInsuranceCard(e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Địa chỉ
              </Label>
              <Input
                id="address"
                placeholder=""
                value={address || ''}
                onChange={(e) => setAddress(e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian-name" className="text-sm font-medium">
                Người giám hộ
              </Label>
              <Input
                id="guardian-name"
                placeholder=""
                value={guardianName || ''}
                onChange={(e) => setGuardianName(e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="text-sm font-medium">
                Điện thoại liên hệ
              </Label>
              <Input
                id="contact-phone"
                placeholder=""
                value={contactPhone || ''}
                onChange={(e) => setContactPhone(e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="text-sm font-medium">
                Chẩn đoán
              </Label>
              <Input
                id="diagnosis"
                placeholder=""
                value={diagnosis || ''}
                onChange={(e) => setDiagnosis(e.target.value || undefined)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Bỏ qua
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const medicineInfoData: PrescriptionInfoRequest = {
                  prescriptionCode,
                  doctorName,
                  hospitalName,
                  patientName,
                  age,
                  // Map UI gender to API gender type
                  gender: gender === 'male' ? 'MALE' : gender === 'female' ? 'FEMALE' : undefined,
                  weight,
                  insuranceCard,
                  address,
                  guardianName,
                  contactPhone,
                  diagnosis,
                };
                onSave(medicineInfoData);
                setIsOpen(false);
              }}
            >
              Xong
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
