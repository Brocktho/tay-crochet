import { z } from 'zod'

export const CategoryNameSchema = z.string().min(1, 'Name is requried')
