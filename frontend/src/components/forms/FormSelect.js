import React from 'react';
import { ChevronDownIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Composant Select de formulaire réutilisable avec validation
 */
const FormSelect = ({
  label,
  name,
  options = [],
  placeholder = 'Sélectionner...',
  register,
  error,
  required = false,
  disabled = false,
  helperText,
  className = '',
  ...rest
}) => {
  const selectId = `select-${name}`;
  
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          className={`
            block w-full rounded-lg border px-3 py-2.5
            text-gray-900 appearance-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300'
            }
          `}
          {...register(name)}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {error ? (
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormSelect;

