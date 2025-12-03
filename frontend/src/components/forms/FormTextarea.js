import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Composant Textarea de formulaire réutilisable avec validation
 */
const FormTextarea = ({
  label,
  name,
  placeholder,
  register,
  error,
  required = false,
  disabled = false,
  helperText,
  rows = 4,
  maxLength,
  showCharCount = false,
  className = '',
  ...rest
}) => {
  const textareaId = `textarea-${name}`;
  const [charCount, setCharCount] = React.useState(0);
  
  const handleChange = (e) => {
    setCharCount(e.target.value.length);
  };
  
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          id={textareaId}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          onChange={handleChange}
          className={`
            block w-full rounded-lg border px-3 py-2.5
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            resize-y
            ${error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300'
            }
          `}
          {...register(name)}
          {...rest}
        />
        
        {error && (
          <div className="absolute top-2 right-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <div className="flex-1">
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
          
          {error && (
            <p className="text-sm text-red-600">{error.message}</p>
          )}
        </div>
        
        {showCharCount && maxLength && (
          <p className="text-xs text-gray-400 ml-2">
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormTextarea;

