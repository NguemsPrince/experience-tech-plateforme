import React from 'react';

/**
 * Composant Checkbox de formulaire réutilisable avec validation
 */
const FormCheckbox = ({
  label,
  name,
  register,
  error,
  required = false,
  disabled = false,
  helperText,
  className = '',
  ...rest
}) => {
  const checkboxId = `checkbox-${name}`;
  
  return (
    <div className={`form-group ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            className={`
              w-4 h-4 rounded border-gray-300 
              text-blue-600 
              focus:ring-2 focus:ring-blue-500
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-300' : ''}
            `}
            {...register(name)}
            {...rest}
          />
        </div>
        
        <div className="ml-3 flex-1">
          <label 
            htmlFor={checkboxId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {helperText && !error && (
            <p className="mt-0.5 text-xs text-gray-500">{helperText}</p>
          )}
          
          {error && (
            <p className="mt-0.5 text-xs text-red-600">{error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCheckbox;

