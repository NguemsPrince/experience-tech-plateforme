import React from 'react';
import { XMarkIcon, ShoppingCartIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, isInCart }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ShoppingCartIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase">
                  {typeof product.category === 'string' ? product.category : (product.category?.name || 'Non défini')}
                </span>
                {product.brand && (
                  <span className="text-sm text-gray-500 ml-2">
                    • {typeof product.brand === 'string' ? product.brand : (product.brand?.name || String(product.brand))}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  ({product.rating?.toFixed(1) || 0}) • {product.totalSold || 0} ventes
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {product.price?.toLocaleString('fr-FR')} FCFA
                  </span>
                  {product.previousPrice && product.previousPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through ml-3">
                      {product.previousPrice.toLocaleString('fr-FR')} FCFA
                    </span>
                  )}
                </div>
                {product.previousPrice && product.previousPrice > product.price && (
                  <p className="text-sm text-green-600 mt-1">
                    Économisez {((product.previousPrice - product.price) / 1000).toFixed(0)}k FCFA
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <p className="text-green-600 font-medium">
                    ✓ En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                  </p>
                ) : (
                  <p className="text-red-600 font-medium">✗ Rupture de stock</p>
                )}
              </div>

              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-gray-500 mb-4">Référence: {product.sku}</p>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={product.stock === 0 || isInCart}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center"
              >
                {isInCart ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Déjà dans le panier
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Tags/Features */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Caractéristiques</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

