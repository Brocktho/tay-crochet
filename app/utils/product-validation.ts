import { z } from 'zod'
import {
	USERNAME_MAX_LENGTH,
	USERNAME_MIN_LENGTH,
} from '#app/utils/user-validation.ts'
import { MAX_UPLOAD_SIZE } from '#app/routes/users+/$username_+/__note-editor.tsx'

// title String
// description String
/*
product preview
  description String
  imagePath String
product variant
  title String
  imagePath String
  isDefault Boolean
  quantity Int
  price Int
 */

export const PRODUCT_MIN_LENGTH = 3
export const PRODUCT_MAX_LENGTH = 191

export const ProductNameSchema = z
	.string({ required_error: 'You must specify a Product Name.' })
	.min(PRODUCT_MIN_LENGTH, { message: 'Product Name is too short' })
	.max(PRODUCT_MAX_LENGTH, { message: 'Product Name is too long' })
	.regex(/^[a-zA-Z0-9_-]+$/, {
		message: 'Username can only include letters, numbers, and underscores',
	})
export const ProductMainImageSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3MB'),
	altText: z.string().optional(),
})
export const ProductDescriptionSchema = z
	.string()
	.min(PRODUCT_MIN_LENGTH, { message: 'Product Description is too short' })
	.regex(/^[a-zA-Z0-9_-]+$/, {
		message: 'Description can only include letters, numbers, and underscores',
	})
export const ProductQuantitySchema = z.number()

export const ProductPriceSchema = z.number()
