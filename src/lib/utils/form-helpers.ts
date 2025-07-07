/**
 * Utility functions for form data handling
 */

/**
 * Converts empty strings to null for UUID fields
 * This prevents PostgreSQL UUID validation errors
 */
export function sanitizeUuidFields<T extends Record<string, any>>(
  data: T,
  uuidFields: (keyof T)[]
): T {
  const sanitized = { ...data }
  
  uuidFields.forEach(field => {
    if (sanitized[field] === '' || sanitized[field] === undefined) {
      sanitized[field] = null as any
    }
  })
  
  return sanitized
}

/**
 * Common UUID fields used across admin forms
 */
export const COMMON_UUID_FIELDS = {
  experiences: ['category_id', 'city_id', 'subcategory_id'],
  blog_posts: ['category_id', 'author_id'],
  reviews: ['user_id', 'product_id'],
  cart_items: ['user_id', 'product_id'],
  orders: ['user_id'],
  order_items: ['order_id', 'product_id'],
  testimonials: ['experience_id'],
  internal_links: ['section_id', 'experience_id']
} as const