const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateField = (
  name: string,
  value: string,
  required: boolean,
  state: Record<string, any>
): string => {
  switch (name) {
    case 'email':
      if (!value && required) return 'Email is required!';
      if (value && !emailRegex.test(value)) return 'Invalid email format!';
      break;

    case 'password':
      if (!value && required) return 'Password is required!';
      if (value && value.length < 6) return 'Password must be at least 6 characters!';
      break;

    case 'confirmPassword':
      if (!value && required) return 'Confirm password is required!';
      if (value && value !== state.password) return 'Passwords do not match!';
      break;

    case 'oldPassword':
      if (!value && required) return 'Old password is required!';
      break;

    case 'newPassword':
      if (!value && required) return 'New password is required!';
      if (value && value.length < 6) return 'Password must be at least 6 characters!';
      break;

    case 'confirmNewPassword':
      if (!value && required) return 'Confirm new password is required!';
      if (value && value !== state.newPassword) return 'New passwords do not match!';
      break;

    case 'username':
      if (!value && required) return 'Username is required!';
      if (value && value.length < 3) return 'Username must be at least 3 characters!';
      break;

    case 'name':
      if (!value && required) return 'Name is required!';
      break;

    case 'description':
      if (!value && required) return 'Description is required!';
      if (value && value.length > 500) return 'Description must be less than 500 characters!';
      break;

    case 'phone':
      if (!value && required) return 'Phone number is required!';
      // Vietnamese phone numbers start with 0 or +84, followed by 9 digits 
      if (value && !/^[35789][0-9]{8}$/.test(value))
        return 'Invalid Vietnamese phone number format!';
      break;

    default:
      return '';
  }
  return '';
};
