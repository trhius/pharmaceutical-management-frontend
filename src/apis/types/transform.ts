export const roles = [
  { label: 'Quản trị viên', value: 'SUPER_ADMIN' },
  { label: 'Quản lý cửa hàng', value: 'STORE_MANAGER' },
  { label: 'Dược sĩ', value: 'PHARMACIST' },
  { label: 'Nhân viên hàng hóa', value: 'INVENTORY_STAFF' },
];

export const genders = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
];

export const ageGroups = [
  { label: 'Trẻ em', value: 'CHILD' },
  { label: 'Trẻ vị thành niên', value: 'TEEN' },
  { label: 'Trưởng thành', value: 'ADULT' },
  { label: 'Người cao tuổi', value: 'ELDERLY' },
];

export const employeeStatuses = [
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Ngừng hoạt động', value: 'INACTIVE' },
  { label: 'Đình chỉ', value: 'SUSPENDED' },
  { label: 'Đang nghỉ phép', value: 'ON_LEAVE' },
];

export const paymentMethods = [
  { label: 'Tiền mặt', value: 'CASH' },
  { label: 'Thẻ tín dụng', value: 'CREDIT_CARD' },
  { label: 'Chuyển khoản', value: 'BANK_TRANSFER' },
  { label: 'Thanh toán di động', value: 'MOBILE_PAYMENT' },
  { label: 'Khác', value: 'OTHER' },
];

export const orderStatusMap: {
  [key: string]: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'outline' };
} = {
  NEW: { label: 'Mới', variant: 'secondary' },
  COMPLETED: { label: 'Hoàn thành', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
  RETURNED: { label: 'Đã trả hàng', variant: 'outline' },
};
