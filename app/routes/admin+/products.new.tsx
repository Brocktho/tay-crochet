import { parseWithZod } from '@conform-to/zod'
import { parseFormData } from '@mjackson/form-data-parser'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { createId as cuid } from '@paralleldrive/cuid2'
import { useEffect, useState } from 'react'
import { data, redirect, useNavigate } from 'react-router'
import { ulid } from 'ulid'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import ProductForm from '#app/routes/admin+/__product-editor.tsx'
import {
	type ImageFieldset,
	MAX_UPLOAD_SIZE,
} from '#app/routes/users+/$username_+/__note-editor.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { requireUserWithRole } from '#app/utils/permissions.server.ts'
import {
	ProductDescriptionSchema,
	ProductMainImageSchema,
	ProductNameSchema,
	ProductPriceSchema,
	ProductQuantitySchema,
} from '#app/utils/product-validation.ts'
import { uploadProductImage } from '#app/utils/storage.server.ts'
import { type Route } from './+types/products.new.ts'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserWithRole(request, 'admin')
	return null
}

function imageHasFile(
	image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
	return Boolean(image.file?.size && image.file?.size > 0)
}

function imageHasId(
	image: ImageFieldset,
): image is ImageFieldset & { id: string } {
	return Boolean(image.id)
}

export async function action({ request }: Route.ActionArgs) {
	await requireUserWithRole(request, 'admin')
	const formData = await parseFormData(request, {
		maxFileSize: MAX_UPLOAD_SIZE,
	})

	const submission = await parseWithZod(formData, {
		schema: ProductSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const product = await prisma.product.findUnique({
				select: { id: true },
				where: { id: data.id },
			})
			if (!product) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Product not found',
				})
			}
		}).transform(async ({ variants = [], ...data }) => {
			const productId = data.id ?? ulid()
			const variantUpdatesP = Promise.all(
				variants.filter(imageHasId).map(async (variant) => {
					const variantId = variant.id ?? ulid()
					const previewUpdates = await Promise.all(
						variant.previews.filter(imageHasId).map(async (preview) => {
							if (imageHasFile(preview)) {
								return {
									id: preview.id,
									altText: preview.altText,
									objectKey: await uploadProductImage(
										productId,
										variantId,
										preview.file,
									),
								}
							}
							return {
								id: preview.id,
								altText: preview.altText,
							}
						}),
					)
					const newPreviews = await Promise.all(
						variant.previews
							.filter(imageHasFile)
							.filter((preview) => !preview.id)
							.map(async (preview) => {
								return {
									altText: preview.altText,
									objectKey: await uploadProductImage(
										productId,
										variantId,
										preview.file,
									),
								}
							}),
					)
					const updatedMainImage = imageHasFile(variant.mainImage) && {
						altText: variant.mainImage.altText,
						objectKey: await uploadProductImage(
							productId,
							variantId,
							variant.mainImage.file,
						),
					}
					return {
						...variant,
						variantId,
						previewUpdates,
						newPreviews,
						updatedMainImage,
					}
				}),
			)
			const newVariantsP = Promise.all(
				variants
					.filter((variant) => imageHasFile(variant.mainImage))
					.filter((variant) => !variant.id)
					.map(async (variant) => {
						const variantId = ulid()
						const newPreviews = await Promise.all(
							variant.previews.filter(imageHasFile).map(async (preview) => {
								return {
									altText: preview.altText,
									objectKey: await uploadProductImage(
										productId,
										variantId,
										preview.file,
									),
								}
							}),
						)
						const mainImage = {
							altText: variant.mainImage.altText,
							objectKey: await uploadProductImage(
								productId,
								variantId,
								variant.mainImage.file!,
							),
						}
						return {
							...variant,
							variantId,
							newPreviews,
							mainImage,
						}
					}),
			)
			const [variantUpdates, newVariants] = await Promise.all([
				variantUpdatesP,
				newVariantsP,
			])
			return {
				...data,
				id: productId,
				variantUpdates,
				newVariants,
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const {
		id: productId,
		title,
		category,
		newVariants,
		variantUpdates,
		redirectTo,
		category: categoryId,
		description,
	} = submission.value

	const updatedProduct = await prisma.product.upsert({
		select: { id: true },
		where: { id: productId },
		create: {
			id: productId,
			title,
			description,
			categoryId,
			isDeleted: false,
			variants: {
				create: newVariants.map((variant) => {
					return {
						id: variant.variantId,
						quantity: variant.quantity,
						available: variant.quantity,
						price: variant.price,
						title: variant.title,
						isDefault: false,
						imageAltText: variant.mainImage.altText || '',
						imagePath: variant.mainImage.objectKey,
						previews: {
							create: variant.newPreviews.map((preview) => {
								return {
									imageAltText: preview.altText || '',
									imagePath: preview.objectKey,
								}
							}),
						},
					}
				}),
			},
		},
		update: {
			title,
			description,
			categoryId,
			variants: {
				create: newVariants.map((variant) => {
					return {
						id: variant.variantId,
						quantity: variant.quantity,
						available: variant.quantity,
						price: variant.price,
						title: variant.title,
						isDefault: false,
						imageAltText: variant.mainImage.altText || '',
						imagePath: variant.mainImage.objectKey,
						previews: {
							create: variant.newPreviews.map((preview) => {
								return {
									imageAltText: preview.altText || '',
									imagePath: preview.objectKey,
								}
							}),
						},
					}
				}),
				update: variantUpdates.map((variant) => {
					return {
						where: {
							id: variant.variantId,
						},
						data: {
							quantity: variant.quantity,
							available: variant.quantity,
							price: variant.price,
							title: variant.title,
							isDefault: false,
							imageAltText: variant.updatedMainImage
								? variant.updatedMainImage.altText
								: undefined,
							imagePath: variant.updatedMainImage
								? variant.updatedMainImage.objectKey
								: undefined,
							previews: {
								create: variant.newPreviews.map((preview) => {
									return {
										imageAltText: preview.altText || '',
										imagePath: preview.objectKey,
									}
								}),
								deleteMany: {
									id: {
										notIn: variant.previewUpdates.map((preview) => preview.id),
									},
								},
								updateMany: variant.previewUpdates.map((preview) => {
									return {
										where: {
											id: preview.id,
										},
										data: {
											imageAltText: preview.altText,
											imagePath: preview.objectKey,
											id: preview.objectKey ? cuid() : preview.id,
										},
									}
								}),
							},
						},
					}
				}),
			},
		},
	})

	throw redirect(`/admin/products`)
}

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

export const ProductVariantSchema = z.object({
	id: z.string().optional(),
	title: ProductNameSchema,
	quantity: ProductQuantitySchema,
	price: ProductPriceSchema,
	mainImage: ProductMainImageSchema,
	previews: z.array(ProductMainImageSchema),
})

export const ProductSchema = z.object({
	id: z.string().optional(),
	title: ProductNameSchema,
	description: ProductDescriptionSchema,
	category: z.string(),
	variants: z.array(ProductVariantSchema),
	redirectTo: z.string().optional(),
	remember: z.boolean().optional(),
})

export default ProductForm

let timeout: NodeJS.Timeout
export function Redirect403() {
	const [redirectTime, setRedirectTime] = useState(5)
	const navigate = useNavigate()
	useEffect(() => {
		clearTimeout(timeout)
		timeout = setInterval(() => {
			setRedirectTime((prev) => prev - 1)
		}, 1000)
		return () => {
			clearTimeout(timeout)
		}
	}, [])

	useEffect(() => {
		if (redirectTime <= 0) {
			void navigate('/')
		}
	}, [redirectTime, navigate])

	return (
		<div className={'flex w-full flex-col items-center justify-center gap-3'}>
			<p className={'text-center'}>You are not allowed to do that</p>
			<p className={'text-center'}>Redirecting in {redirectTime}...</p>
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: Redirect403,
			}}
		/>
	)
}
