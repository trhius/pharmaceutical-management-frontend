import { useRef, useState, useEffect, useCallback } from 'react';

import { validateField } from 'src/utils/validation';

import { useDebounce } from './use-debounce';

export function useDebounceForm<T extends Record<string, any>>(form: Form<T>) {
  return useCustomDelayDebounceForm(form, 500);
}

type Form<T> = {
  initialState: T;
  requiredFields: string[];
};

export function useCustomDelayDebounceForm<T extends Record<string, any>>(
  form: Form<T>,
  delay: number
) {
  const [formData, setFormData] = useState<T>(form.initialState);
  const [formError, setFormError] = useState<T>(form.initialState);

  const [inputValue, setInputValue] = useState<{ name: string; value: string } | null>(null);
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
        value,
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValue({ name, value });

    // Update form data
    setFormError((prevError) => ({ ...prevError, [name]: '' }));
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      formDataRef.current = updatedData; // Update the ref copy
      return updatedData;
    });

    // Add the field to the debouncedFields set
    setDebouncedFields((prev) => new Set(prev).add(name));
  };

  const isValidForm = () => {
    // Check if all required fields are filled
    const isAllRequiredFieldsFilled = form.requiredFields.every(
      (field) => formDataRef.current[field]
    );
    // Check if all debounced fields are processed
    const isAllDebouncedFieldsProcessed = debouncedFields.size === 0;
    let isValid = isAllRequiredFieldsFilled && isAllDebouncedFieldsProcessed;
    // Check if there are any errors in formError
    Object.keys(formError).forEach((key) => {
      if (formError[key as keyof T]) {
        isValid = false;
      }
    });
    return isValid;
  };

  const resetForm = useCallback(() => {
    setFormData(form.initialState);
    setFormError(form.initialState);
    setInputValue(null);
    setDebouncedFields(new Set());
    formDataRef.current = form.initialState; // Reset the ref copy
  }, [form.initialState]);

  return { formData, formError, handleInputChange, setFormError, isValidForm, resetForm };
}
