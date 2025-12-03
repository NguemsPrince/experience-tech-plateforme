/**
 * Utility functions to normalize data from backend to ensure objects are converted to strings
 * This prevents React errors: "Objects are not valid as a React child"
 */

/**
 * Normalize category value (string or object) to string
 */
export const normalizeCategory = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category !== null) {
    return category.name || category.label || '';
  }
  return String(category || '');
};

/**
 * Normalize level value (string or object) to string
 */
export const normalizeLevel = (level) => {
  if (!level) return '';
  if (typeof level === 'string') return level;
  if (typeof level === 'object' && level !== null) {
    return level.name || level.label || '';
  }
  return String(level || '');
};

/**
 * Normalize instructor value (string or object) to string
 */
export const normalizeInstructor = (instructor) => {
  if (!instructor) return 'Instructeur';
  if (typeof instructor === 'string') return instructor;
  if (typeof instructor === 'object' && instructor !== null) {
    return instructor.name || instructor.fullName || 'Instructeur';
  }
  return String(instructor || 'Instructeur');
};

/**
 * Normalize brand value (string or object) to string
 */
export const normalizeBrand = (brand) => {
  if (!brand) return '';
  if (typeof brand === 'string') return brand;
  if (typeof brand === 'object' && brand !== null) {
    return brand.name || brand.label || '';
  }
  return String(brand || '');
};

/**
 * Normalize rating value (number or object) to number
 */
export const normalizeRating = (rating) => {
  if (typeof rating === 'number') return rating;
  if (rating && typeof rating === 'object') {
    return rating.average !== undefined ? rating.average : (rating.value !== undefined ? rating.value : 0);
  }
  return 0;
};

/**
 * Normalize a complete course object
 */
export const normalizeCourse = (course) => {
  if (!course) return course;
  
  return {
    ...course,
    category: normalizeCategory(course.category),
    level: normalizeLevel(course.level),
    instructor: normalizeInstructor(course.instructor),
    rating: normalizeRating(course.rating)
  };
};

/**
 * Normalize a complete product object
 */
export const normalizeProduct = (product) => {
  if (!product) return product;
  
  return {
    ...product,
    category: normalizeCategory(product.category),
    brand: normalizeBrand(product.brand),
    rating: normalizeRating(product.rating)
  };
};

/**
 * Normalize an array of courses
 */
export const normalizeCourses = (courses) => {
  if (!Array.isArray(courses)) return [];
  return courses.map(normalizeCourse);
};

/**
 * Normalize an array of products
 */
export const normalizeProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(normalizeProduct);
};

export default {
  normalizeCategory,
  normalizeLevel,
  normalizeInstructor,
  normalizeBrand,
  normalizeRating,
  normalizeCourse,
  normalizeProduct,
  normalizeCourses,
  normalizeProducts
};

