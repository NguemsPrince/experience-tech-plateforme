import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

/**
 * Composant Upload de fichier réutilisable avec validation
 */
const FormFileUpload = ({
  label,
  name,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  register,
  error,
  required = false,
  disabled = false,
  helperText,
  onChange,
  multiple = false,
  className = '',
  ...rest
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputId = `file-${name}`;
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Valider la taille des fichiers
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(`Certains fichiers dépassent la taille maximale de ${formatFileSize(maxSize)}`);
      e.target.value = '';
      return;
    }
    
    setSelectedFiles(files);
    
    if (onChange) {
      onChange(files);
    }
  };
  
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    if (onChange) {
      onChange(newFiles);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6
          transition-colors duration-200
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...register(name)}
          onChange={handleFileChange}
          {...rest}
        />
        
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Cliquez pour télécharger</span>
            {' '}ou glissez-déposez
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {accept ? `Fichiers acceptés: ${accept}` : 'Tous les types de fichiers'}
            {' '}• Max {formatFileSize(maxSize)}
          </p>
        </div>
      </div>
      
      {/* Liste des fichiers sélectionnés */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <DocumentIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormFileUpload;

