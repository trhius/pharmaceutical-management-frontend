import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';

interface EditablePriceCellProps {
  initialValue: number | undefined;
  productId: string;
  onPriceChange: (productId: string, price: number) => void;
}

export const EditablePriceCell: React.FC<EditablePriceCellProps> = ({ initialValue, productId, onPriceChange }) => {
  const [price, setPrice] = useState<string>(initialValue !== undefined ? initialValue.toString() : '');

  // Update local state when the initialValue prop changes (e.g., pagination)
  useEffect(() => {
    setPrice(initialValue !== undefined ? initialValue.toString() : '');
  }, [initialValue]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    const newPrice = parseFloat(price);
    // Only call onPriceChange if the value is a valid number
    if (!isNaN(newPrice)) {
      onPriceChange(productId, newPrice);
    } else {
      // Optionally reset or handle invalid input
      // For now, we'll just revert to the initial value if input is invalid on blur
      setPrice(initialValue !== undefined ? initialValue.toString() : '');
    }
  }, [price, productId, onPriceChange, initialValue]);

  return (
    <Input
      type="number"
      value={price}
      onChange={handleInputChange}
      onBlur={handleBlur}
      className="w-full p-1 border rounded"
    />
  );
};
