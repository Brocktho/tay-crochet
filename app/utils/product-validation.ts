import { z } from 'zod'

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
export const ProductNameSchema = z
.string({required_error: "You must specify an Product name."})
.minLength(3, {message: "Product name is too short"})
.maxLength(191, {message: "Product name is too long"});

export const ProductQuantitySchema = z
.number()