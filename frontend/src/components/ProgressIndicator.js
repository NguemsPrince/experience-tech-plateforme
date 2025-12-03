import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ProgressIndicator = ({ 
  steps = [], 
  currentStep = 0, 
  orientation = 'horizontal' // horizontal ou vertical
}) => {
  const isCompleted = (index) => index < currentStep;
  const isCurrent = (index) => index === currentStep;
  const isPending = (index) => index > currentStep;

  const StepIcon = ({ step, index }) => {
    if (isCompleted(index)) {
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    } else if (isCurrent(index)) {
      return (
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{index + 1}</span>
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-semibold">{index + 1}</span>
        </div>
      );
    }
  };

  const StepContent = ({ step, index }) => {
    return (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <StepIcon step={step} index={index} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${
            isCompleted(index) ? 'text-green-600 dark:text-green-400' :
            isCurrent(index) ? 'text-blue-600 dark:text-blue-400' :
            'text-gray-500 dark:text-gray-400'
          }`}>
            {step.title}
          </h3>
          {step.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {step.description}
            </p>
          )}
        </div>
      </div>
    );
  };

  const Connector = ({ isCompleted }) => (
    <div className={`w-full h-0.5 ${
      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
    } transition-colors duration-300`} />
  );

  if (orientation === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex">
            <div className="flex flex-col items-center">
              <StepIcon step={step} index={index} />
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${
                  isCompleted(index) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                } transition-colors duration-300`} />
              )}
            </div>
            <div className="ml-4 flex-1">
              <StepContent step={step} index={index} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <div className="flex items-center">
              <div className="flex-1">
                <StepContent step={step} index={index} />
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <Connector isCompleted={isCompleted(index)} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
