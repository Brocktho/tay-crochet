import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useSearchParams } from 'react-router'
import CategorySelect from '#app/components/Categories/Select.tsx'
import { ErrorList, Field, TextareaField } from '#app/components/forms.tsx'
import { ProductSchema } from '#app/routes/admin+/products.new.tsx'
import { useIsPending } from '#app/utils/misc.tsx'
import { type Route } from '../../../.react-router/types/app/routes/_products+/+types/commissions.ts'

export default function ComissionsPage(_props: Route.ComponentProps) {
	const ignoredisPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getZodConstraint(ProductSchema),
		defaultValue: { redirectTo },
		lastResult: undefined,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ProductSchema })
		},
		shouldRevalidate: 'onBlur',
	})
	return (
		<div className={'container h-full w-full p-6'}>
			<h1 className={'mb-8 w-full text-center text-4xl'}>COMING SOON!</h1>
			<Form
				className={
					'container grid w-full grid-cols-6 gap-0 rounded-xl bg-primary p-3 md:grid-cols-9 lg:grid-cols-12'
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
						className={'col-span-6 -mt-4 md:col-span-3 md:mt-0 lg:col-span-4'}
					/>
				</div>
				<TextareaField
					className={'col-span-6 -mt-4 md:col-span-9 lg:col-span-12'}
					labelProps={{ children: 'Description' }}
					textareaProps={{
						...getTextareaProps(fields.description),
					}}
					errors={fields.description.errors}
				/>
				<input {...getInputProps(fields.redirectTo, { type: 'hidden' })} />
				<ErrorList errors={form.errors} id={form.errorId} />

				<div className="col-start-6 flex w-full flex-row items-end justify-end gap-6 place-self-end md:col-start-9 lg:col-start-12">
					{/*<StatusButton*/}
					{/*	className="w-full"*/}
					{/*	status={isPending ? 'pending' : (form.status ?? 'idle')}*/}
					{/*	type="submit"*/}
					{/*	disabled={isPending}*/}
					{/*>*/}
					{/*	Save*/}
					{/*</StatusButton>*/}
				</div>
			</Form>
		</div>
	)
}
