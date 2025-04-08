import React from 'react';

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  name?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  name,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        name={name || id}
        className={`
          w-full px-3 py-2 bg-tertiary-dark border rounded-md
          focus:outline-none focus:ring-2 focus:ring-accent-teal
          ${error ? 'border-red-500' : 'border-gray-600'}
          text-white placeholder-gray-400
        `}
      />
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;