import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const CartIcon = ({ onOpenCart, itemCount = 0 }) => {
  return (
    <motion.button
      onClick={onOpenCart}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ShoppingCartIcon className="w-6 h-6" />
      
      {/* Badge avec le nombre d'articles */}
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.span>
      )}
    </motion.button>
  );
};

export default CartIcon;
