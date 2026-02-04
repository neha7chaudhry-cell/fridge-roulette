import React from 'react';

interface TextInputProps {
  /** Current input value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Optional className */
  className?: string;
}

/**
 * Text input for typing custom ingredients
 */
export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = 'Type extras: salmon, lemon...',
  className = '',
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 text-base border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
        placeholder:text-gray-400 ${className}`}
    />
  );
};
