import { requireUserWithRole } from '#app/utils/permissions.server.ts'
import { Route } from '../../../.react-router/types/app/routes/admin+/+types/Categories.ts'
import { data, Form, useSearchParams } from 'react-router'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { useIsPending } from '#app/utils/misc.tsx'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import { CategoryNameSchema } from '#app/utils/category-validation.ts'
import { Field } from '#app/components/forms.tsx'
import { createToastHeaders } from '#app/utils/toast.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useEffect } from 'react'
export async function loader({ request }: Route.LoaderArgs) {
	await requireUserWithRole(request, 'admin')
	return null
}

const CategorySchema = z.object({
	Category: CategoryNameSchema,
	redirectTo: z.string().optional(),
})

export async function action({ request }: Route.ActionArgs) {
	await requireUserWithRole(request, 'admin')
	const formData = await request.formData()
	const submission = await parseWithZod(formData, { schema: CategorySchema })

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { Category, redirectTo } = submission.value

	await prisma.productCategories.create({
		data: {
			category: Category,
		},
	})

	const toast = await createToastHeaders({
		type: 'success',
		title: 'Category Created',
		description: `Created: ${Category}`,
	})

	return data({ result: submission.reply() }, { status: 200, headers: toast })
}

export default function CategoryPage({ actionData }: Route.ComponentProps) {
	const isPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'category-form',
		constraint: getZodConstraint(CategorySchema),
		defaultValue: { redirectTo },
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CategorySchema })
		},
		shouldRevalidate: 'onBlur',
	})

	useEffect(() => {
		if (actionData) {
			actionData.result
		}
	}, [actionData])

	return (
		<div className={'container w-full p-6'}>
			<Form
				method={'POST'}
				className={'flex w-full flex-col gap-3 rounded-xl bg-primary p-3'}
				{...getFormProps(form)}
			>
				<Field
					labelProps={{ children: 'Category Name' }}
					className={'col-span-6 md:col-span-6 lg:col-span-8'}
					inputProps={{
						...getInputProps(fields.Category, { type: 'text' }),
						autoFocus: true,
					}}
					errors={fields.Category.errors}
				/>
				<input {...getInputProps(fields.redirectTo, { type: 'hidden' })} />
				<div className="flex w-full items-center justify-end">
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
		</div>
	)
}
