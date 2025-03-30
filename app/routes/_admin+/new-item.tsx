import { useIsPending } from '#app/utils/misc.tsx'
import { Form, useSearchParams } from 'react-router'
import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Route } from './+types/new-item.ts'
import { z } from 'zod'
import {
	ProductDescriptionSchema,
	ProductMainImageSchema,
	ProductNameSchema,
	ProductPriceSchema,
	ProductQuantitySchema,
} from '#app/utils/product-validation.ts'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { ErrorList, Field, TextareaField } from '#app/components/forms.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { ImageChooser } from '#app/routes/users+/$username_+/__note-editor.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import {
	Tooltip,
	Provider,
	Root,
	Trigger,
	Portal,
	Content,
} from '@radix-ui/react-tooltip'
import CategorySelect from '#app/components/Categories/Select.tsx'

export async function loader({ request, params }: Route.LoaderArgs) {}

export function action({}: Route.ActionArgs) {}

export const ProductSchema = z.object({
	title: ProductNameSchema,
	description: ProductDescriptionSchema,
	quantity: ProductQuantitySchema,
	price: ProductPriceSchema,
	mainImage: ProductMainImageSchema,

	redirectTo: z.string().optional(),
	remember: z.boolean().optional(),
})

export default function NewItemPage({ actionData }: Route.ComponentProps) {
	const isPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getZodConstraint(ProductSchema),
		defaultValue: { redirectTo },
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ProductSchema })
		},
		shouldRevalidate: 'onBlur',
	})
	return (
		<Form
			className={
				'container grid w-full grid-cols-6 md:grid-cols-9 lg:grid-cols-12'
			}
			encType={'multipart/form-data'}
			method="POST"
			{...getFormProps(form)}
		>
			<div
				className={
					'col-span-6 grid grid-cols-subgrid gap-3 md:col-span-9 lg:col-span-12'
				}
			>
				<Field
					labelProps={{ children: 'Name' }}
					className={'col-span-3'}
					inputProps={{
						...getInputProps(fields.title, { type: 'text' }),
						autoFocus: true,
					}}
					errors={fields.title.errors}
				/>
				<Field
					className={'col-span-2'}
					labelProps={{
						children: (
							<p className={'pb-1'}>
								Quantity{' '}
								<Provider>
									<Root>
										<Trigger asChild>
											<Icon name={'info-circled'} />
										</Trigger>
										<Portal>
											<Content alignOffset={24}>
												<div
													className={'rounded-xl bg-accent p-3 shadow-accent'}
												>
													The amount of orders you want to allow for this item
												</div>
											</Content>
										</Portal>
									</Root>
								</Provider>
							</p>
						),
					}}
					inputProps={{
						...getInputProps(fields.quantity, { type: 'number' }),
					}}
					errors={fields.quantity.errors}
				></Field>
				<ImageChooser meta={fields.mainImage} />
			</div>

			<CategorySelect />
			<TextareaField
				className={'col-span-6 md:col-span-9 lg:col-span-12'}
				labelProps={{ children: 'Description' }}
				textareaProps={{
					...getTextareaProps(fields.description),
				}}
				errors={fields.description.errors}
			/>
			<input {...getInputProps(fields.redirectTo, { type: 'hidden' })} />
			<ErrorList errors={form.errors} id={form.errorId} />

			<div className="col-start-5 flex gap-6 place-self-end pt-3 md:col-start-8 lg:col-start-11">
				<StatusButton
					className="w-full"
					status={isPending ? 'pending' : (form.status ?? 'idle')}
					type="submit"
					disabled={isPending}
				>
					Add Product
				</StatusButton>
			</div>
		</Form>
	)
}
