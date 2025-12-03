import React, { useState } from 'react';
import Button from './Button';
import { toast } from 'react-hot-toast';

const LoadingButton = ({ 
  children, 
  onClick, 
  successMessage = "Action réussie !",
  errorMessage = "Erreur lors de l'action",
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onClick?.();
      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (error) {
      console.error('Error in LoadingButton:', error);
      if (errorMessage) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      {...props}
      isLoading={isLoading}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;
