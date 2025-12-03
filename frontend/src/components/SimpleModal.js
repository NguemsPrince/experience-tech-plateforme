import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SimpleModal = ({ isOpen, onClose, title, children }) => {
  console.log('SimpleModal render:', { isOpen, title });

  if (!isOpen) {
    console.log('SimpleModal not open, returning null');
    return null;
  }

  console.log('SimpleModal is open, rendering...');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 10001 }}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ border: '5px solid blue' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
