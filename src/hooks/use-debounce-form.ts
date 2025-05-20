import { useRef, useState, useEffect, useCallback } from 'react';

import { validateField } from 'src/utils/validation';

import { useDebounce } from './use-debounce';

export function useDebounceForm<T extends Record<string, any>>(form: Form<T>) {
  return useCustomDelayDebounceForm(form, 500);
}

export type Form<T> = {
  initialState: T;
  requiredFields: string[];
};

export function useCustomDelayDebounceForm<T extends Record<string, any>>(
  form: Form<T>,
  delay: number
) {
  const [formData, setFormData] = useState<T>(form.initialState);
  const [formError, setFormError] = useState<Record<keyof T, string>>(
    () =>
      Object.fromEntries(Object.keys(form.initialState).map((key) => [key, ''])) as Record<
        keyof T,
        string
      >
  );

  console.log('formData', formData);
  console.log('formError', formError);

  const [inputValue, setInputValue] = useState<{
    name: string;
    value: string | boolean;
  } | null>(null);
  const [debouncedFields, setDebouncedFields] = useState<Set<string>>(new Set());

  // Keep a mutable copy of formData
  const formDataRef = useRef<T>(form.initialState);

  // Debounce the input value
  const debouncedInput = useDebounce(inputValue, delay);

  // Update form data and validate when debounced input changes
  useEffect(() => {
    if (debouncedInput) {
      const { name, value } = debouncedInput;

      // Validate the field and set error
      const error = validateField(
        name,
        value as string,
        form.requiredFields.includes(name),
        formDataRef.current
      );
      setFormError((prevError) => ({ ...prevError, [name]: error }));

      // Remove the field from debouncedFields since it's being updated
      setDebouncedFields((prev) => {
        const updated = new Set(prev);
        updated.delete(name);
        return updated;
      });
    }
  }, [debouncedInput, form.requiredFields]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, name, value: val, checked } = event.target;

    const value = type === 'checkbox' ? checked : val;

    if (['text', 'password', 'number', 'email'].includes(type)) {
      setInputValue({ name, value });

      setFormError((prevError) => ({ ...prevError, [name]: '' }));

      // Add the field to the debouncedFields set
      setDebouncedFields((prev) => new Set(prev).add(name));
    }

    // Update form data
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      formDataRef.current = updatedData; // Update the ref copy
      return updatedData;
    });
  }, []);

  const isValidForm = () => {
    const allFilled = form.requiredFields.every((field) => formDataRef.current[field]);

    const noErrors = Object.values(formError).every((val) => !val);
    Object.values(formError).forEach((val) => console.log(val));
    const noDebouncePending = debouncedFields.size === 0;

    console.log(allFilled, noErrors, noDebouncePending);

    return allFilled && noErrors && noDebouncePending;
  };

  const resetForm = useCallback(
    (data?: Partial<typeof form.initialState>) => {
      const newFormData = { ...form.initialState, ...data };
      setFormData(newFormData);
      setFormError(
        Object.fromEntries(Object.keys(form.initialState).map((key) => [key, ''])) as Record<
          keyof T,
          string
        >
      );
      setInputValue(null);
      setDebouncedFields(new Set());
      formDataRef.current = newFormData; // Reset the ref copy
    },
    [form]
  );

  return { formData, formError, handleInputChange, setFormError, isValidForm, resetForm };
}
