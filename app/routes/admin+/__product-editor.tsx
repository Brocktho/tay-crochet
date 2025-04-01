import {
	type FieldMetadata,
	type FormMetadata,
	FormProvider,
	getFieldsetProps,
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
	useInputControl,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useState } from 'react'
import { Form, useSearchParams } from 'react-router'
import { type z } from 'zod'
import CategorySelect from '#app/components/Categories/Select.tsx'
import { ErrorList, Field, TextareaField } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { Textarea } from '#app/components/ui/textarea.tsx'
import {
	ProductSchema,
	type ProductVariantSchema,
} from '#app/routes/admin+/products.new.tsx'
import { type ImageFieldset } from '#app/routes/users+/$username_+/__note-editor.tsx'
import { cn, getNoteImgSrc, useIsPending } from '#app/utils/misc.tsx'
import { type Info } from './+types/products.$productId_.edit.ts'

export type NewProductEditorProps = {
	product: Info['loaderData']['product']
	actionData: Info['actionData']
}

export type ProductMeta = z.infer<typeof ProductSchema>
export type ProductVariantMeta = z.infer<typeof ProductVariantSchema>

export default function ProductForm({
	actionData,
	product,
}: NewProductEditorProps) {
	const isPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'product-form',
		constraint: getZodConstraint(ProductSchema),
		defaultValue: product
			? {
					...product,
					category: product.category.id,
					redirectTo,
				}
			: { redirectTo, variants: [{}] },
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ProductSchema })
		},
		shouldRevalidate: 'onBlur',
	})
	const category = useInputControl(fields.category)
	const variants = fields.variants.getFieldList()
	return (
		<div className={'w-full px-3'}>
			<FormProvider context={form.context}>
				<Form
					className={
						'container col-span-5 grid w-full grid-cols-6 gap-0 rounded-xl bg-secondary p-3 md:grid-cols-9 lg:grid-cols-12'
					}
					encType={'multipart/form-data'}
					method="POST"
					{...getFormProps(form)}
				>
					<div
						className={
							'col-span-6 grid grid-cols-subgrid gap-0 md:col-span-9 md:gap-3 lg:col-span-12'
						}
					>
						<Field
							labelProps={{ children: 'Name' }}
							className={'col-span-6 md:col-span-6 lg:col-span-8'}
							inputProps={{
								...getInputProps(fields.title, { type: 'text' }),
								autoFocus: true,
							}}
							errors={fields.title.errors}
						/>
						<CategorySelect
							onChange={category.change}
							className={'col-span-6 -mt-6 md:col-span-3 md:mt-0 lg:col-span-4'}
						/>
					</div>
					<TextareaField
						className={'col-span-6 md:col-span-9 md:-mt-6 lg:col-span-12'}
						labelProps={{ children: 'Description' }}
						textareaProps={{
							...getTextareaProps(fields.description),
						}}
						errors={fields.description.errors}
					/>
					<div
						className={
							'col-span-6 grid grid-cols-subgrid gap-3 md:col-span-9 lg:col-span-12'
						}
					>
						{variants.map((variant, index) => {
							return (
								<div
									key={variant.key}
									className="relative col-span-full grid grid-cols-subgrid"
								>
									<button
										className="absolute right-0 top-0 text-foreground-destructive"
										{...form.remove.getButtonProps({
											name: fields.variants.name,
											index,
										})}
									>
										<span aria-hidden>
											<Icon name="cross-1" />
										</span>{' '}
										<span className="sr-only">Remove image {index + 1}</span>
									</button>
									<ProductVariantForm
										form={form}
										meta={variant}
										index={index}
									/>
								</div>
							)
						})}
					</div>

					<input {...getInputProps(fields.redirectTo, { type: 'hidden' })} />
					<ErrorList errors={form.errors} id={form.errorId} />

					<div className="col-span-2 col-start-5 flex w-full flex-row items-end justify-end gap-6 place-self-end md:col-start-8 lg:col-start-11">
						<Button
							className="mt-3"
							{...form.insert.getButtonProps({
								name: fields.variants.name,
							})}
						>
							<span aria-hidden>
								<Icon name="plus">Product Variant</Icon>
							</span>{' '}
							<span className="sr-only">Add Variant</span>
						</Button>
						<StatusButton
							className="w-full"
							status={isPending ? 'pending' : (form.status ?? 'idle')}
							type="submit"
							disabled={isPending}
						>
							Save
						</StatusButton>
					</div>
				</Form>
			</FormProvider>
		</div>
	)
}

export function ProductPreviewForm({
	meta,
}: {
	meta: FieldMetadata<ImageFieldset>
}) {
	const fields = meta.getFieldset()
	const existingImage = Boolean(fields.id.initialValue)
	const [previewImage, setPreviewImage] = useState<string | null>(
		fields.id.initialValue ? getNoteImgSrc(fields.id.initialValue) : null,
	)
	const [altText, setAltText] = useState(fields.altText.initialValue ?? '')

	return (
		<fieldset
			className={'rounded-xl bg-secondary p-3'}
			{...getFieldsetProps(meta)}
		>
			<div className="flex gap-3">
				<div className="w-32">
					<div className="relative h-32 w-32">
						<label
							htmlFor={fields.file.id}
							className={cn('group absolute h-32 w-32 rounded-lg', {
								'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
									!previewImage,
								'cursor-pointer focus-within:ring-2': !existingImage,
							})}
						>
							{previewImage ? (
								<div className="relative">
									<img
										src={previewImage}
										alt={altText ?? ''}
										className="h-32 w-32 rounded-lg object-cover"
									/>
									{existingImage ? null : (
										<div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
											new
										</div>
									)}
								</div>
							) : (
								<div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
									<Icon name="plus" />
								</div>
							)}
							{existingImage ? (
								<input
									{...getInputProps(fields.id, { type: 'hidden' })}
									key={fields.id.key}
								/>
							) : null}
							<input
								aria-label="Image"
								className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
								onChange={(event) => {
									const file = event.target.files?.[0]

									if (file) {
										const reader = new FileReader()
										reader.onloadend = () => {
											setPreviewImage(reader.result as string)
										}
										reader.readAsDataURL(file)
									} else {
										setPreviewImage(null)
									}
								}}
								accept="image/*"
								{...getInputProps(fields.file, { type: 'file' })}
								key={fields.file.key}
							/>
						</label>
					</div>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList id={fields.file.errorId} errors={fields.file.errors} />
					</div>
				</div>
				<div className="flex-1">
					<Label htmlFor={fields.altText.id}>Alt Text</Label>
					<Textarea
						onChange={(e) => setAltText(e.currentTarget.value)}
						{...getTextareaProps(fields.altText)}
						key={fields.altText.key}
					/>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={fields.altText.errorId}
							errors={fields.altText.errors}
						/>
					</div>
				</div>
			</div>
			<div className="min-h-[32px] px-4 pb-3 pt-1">
				<ErrorList id={meta.errorId} errors={meta.errors} />
			</div>
		</fieldset>
	)
}

export function ProductVariantForm({
	meta,
	index,
	form,
}: {
	meta: FieldMetadata<ProductVariantMeta>
	index: number
	form: FormMetadata<ProductMeta>
}) {
	const variantFields = meta.getFieldset()
	const fields = variantFields.mainImage.getFieldset()
	const existingImage = Boolean(fields.id.initialValue)
	const [previewImage, setPreviewImage] = useState<string | null>(
		fields.id.initialValue ? getNoteImgSrc(fields.id.initialValue) : null,
	)
	const [altText, setAltText] = useState(fields.altText.initialValue ?? '')
	const thisInd = index + 1
	const previews = variantFields.previews.getFieldList()
	return (
		<fieldset
			{...getFieldsetProps(meta)}
			className={
				'col-span-full grid grid-cols-subgrid rounded-xl bg-primary p-3'
			}
		>
			<h1 className={'col-span-full w-full text-lg'}>
				Variant {thisInd} {thisInd === 1 && '(Primary Variant)'}
			</h1>
			<Field
				className={'col-span-3 md:col-span-6 lg:col-span-8'}
				labelProps={{ children: 'Title' }}
				inputProps={getInputProps(variantFields.title, { type: 'text' })}
				errors={variantFields.title.errors}
			/>
			<Field
				className={'col-span-2 md:col-span-2'}
				labelProps={{ children: 'Price' }}
				inputProps={getInputProps(variantFields.price, { type: 'number' })}
				errors={variantFields.price.errors}
			/>
			<Field
				className={'lg:col-span-2'}
				labelProps={{ children: 'Quantity' }}
				inputProps={{
					...getInputProps(variantFields.quantity, { type: 'number' }),
					key: variantFields.quantity.key,
				}}
				errors={variantFields.quantity.errors}
			/>
			<div className="col-span-full flex gap-3">
				<div className="w-32">
					<p>Main Image</p>
					<div className="relative h-32 w-32">
						<label
							htmlFor={fields.file.id}
							className={cn('group absolute h-32 w-32 rounded-lg', {
								'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
									!previewImage,
								'cursor-pointer focus-within:ring-2': !existingImage,
							})}
						>
							{previewImage ? (
								<div className="relative">
									<img
										src={previewImage}
										alt={altText ?? ''}
										className="h-32 w-32 rounded-lg object-cover"
									/>
									{existingImage ? null : (
										<div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
											new
										</div>
									)}
								</div>
							) : (
								<div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
									<Icon name="plus" />
								</div>
							)}
							{existingImage ? (
								<input
									{...getInputProps(fields.id, { type: 'hidden' })}
									key={fields.id.key}
								/>
							) : null}
							<input
								aria-label="Image"
								className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
								onChange={(event) => {
									const file = event.target.files?.[0]

									if (file) {
										const reader = new FileReader()
										reader.onloadend = () => {
											setPreviewImage(reader.result as string)
										}
										reader.readAsDataURL(file)
									} else {
										setPreviewImage(null)
									}
								}}
								accept="image/*"
								{...getInputProps(fields.file, { type: 'file' })}
								key={fields.file.key}
							/>
						</label>
					</div>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList id={fields.file.errorId} errors={fields.file.errors} />
					</div>
				</div>
				<div className="flex-1">
					<Label htmlFor={fields.altText.id}>Main Image Alt Text</Label>
					<Textarea
						onChange={(e) => setAltText(e.currentTarget.value)}
						{...getTextareaProps(fields.altText)}
						key={fields.altText.key}
					/>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={fields.altText.errorId}
							errors={fields.altText.errors}
						/>
					</div>
				</div>
			</div>
			<div className="min-h-[32px] px-4 pb-3 pt-1">
				<ErrorList id={meta.errorId} errors={meta.errors} />
			</div>
			<div className={'col-span-full flex flex-col gap-3'}>
				{previews.map((preview) => {
					return (
						<div className={'col-span-full'} key={preview.key}>
							<ProductPreviewForm meta={preview} />
						</div>
					)
				})}
			</div>
			<div className={'col-span-full flex flex-row items-center justify-end'}>
				<Button
					className="mt-3"
					{...form.insert.getButtonProps({
						name: `variants[${index}].previews[${previews.length}]`,
					})}
				>
					<span aria-hidden>
						<Icon name="plus">Preview</Icon>
					</span>{' '}
					<span className="sr-only">Add Preview</span>
				</Button>
			</div>
		</fieldset>
	)
}
