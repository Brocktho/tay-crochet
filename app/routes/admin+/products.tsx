import { type ProductVariant } from '.prisma/client'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { data, Form, Outlet, useSearchParams } from 'react-router'
import { z } from 'zod'
import { ErrorList } from '#app/components/forms.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { prisma } from '#app/utils/db.server.ts'
import {
	getNoteImgSrc,
	getProductImgSrc,
	useIsPending,
} from '#app/utils/misc.tsx'
import { requireUserWithRole } from '#app/utils/permissions.server.ts'
import { createToastHeaders } from '#app/utils/toast.server.ts'
import { type Route } from '../../../.react-router/types/app/routes/admin+/+types/products.ts'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserWithRole(request, 'admin')
	const products = await prisma.productVariant.findMany({
		select: {
			id: true,
			title: true,
			available: true,
			isDeleted: true,
			imageAltText: true,
		},
	})
	return { products }
}

const ProductUpdateSchema = z.object({
	id: z.string(),
	intent: z.enum(['increment', 'decrement', 'delete', 're-create']),
})

export async function action({ request }: Route.ActionArgs) {
	await requireUserWithRole(request, 'admin')
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: ProductUpdateSchema,
	})
	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply(), id: formData.get('id') },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { id, intent } = submission.value

	let toast: Headers
	switch (intent) {
		case 'increment':
			await prisma.productVariant.update({
				where: {
					id,
				},
				data: {
					available: { increment: 1 },
				},
			})
			toast = await createToastHeaders({
				type: 'success',
				title: 'Product Quantity Updated',
				description: `Increased Product Quantity`,
			})
			break
		case 'decrement':
			await prisma.productVariant.update({
				where: {
					id,
				},
				data: {
					available: { decrement: 1 },
				},
			})
			toast = await createToastHeaders({
				type: 'success',
				title: 'Product Quantity Updated',
				description: `Decreased Product Quantity`,
			})
			break
		case 'delete':
			await prisma.productVariant.update({
				where: {
					id,
				},
				data: {
					isDeleted: true,
				},
			})
			await prisma.product.updateMany({
				where: {
					variants: {
						every: {
							isDeleted: true,
						},
					},
				},
				data: {
					isDeleted: true,
				},
			})
			toast = await createToastHeaders({
				type: 'success',
				title: 'Product Deleted',
				description: `Deleted Product`,
			})
			break
		case 're-create':
			await prisma.productVariant.update({
				where: {
					id,
				},
				data: {
					isDeleted: false,
				},
			})
			await prisma.product.updateMany({
				where: {
					variants: {
						some: {
							isDeleted: false,
						},
					},
				},
				data: {
					isDeleted: false,
				},
			})
			toast = await createToastHeaders({
				type: 'success',
				title: 'Product re-created',
				description: 'Added product back',
			})
	}

	return data(
		{ result: submission.reply(), id },
		{ status: 200, headers: toast },
	)
}

type ProductUpdateCardProps = {
	intentData?: Route.ComponentProps['actionData']
} & Pick<
	ProductVariant,
	'available' | 'id' | 'isDeleted' | 'title' | 'imageAltText'
>

function ProductUpdateCard({
	title,
	available,
	id,
	isDeleted,
	intentData,
	imageAltText,
}: ProductUpdateCardProps) {
	const isPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: `product-update-${id}`,
		constraint: getZodConstraint(ProductUpdateSchema),
		lastResult: intentData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ProductUpdateSchema })
		},
		defaultValue: {
			id,
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className={'max-w-[15rem] flex-1 rounded-xl'}>
			<a href={getProductImgSrc(id)}>
				<img
					src={getProductImgSrc(id)}
					alt={imageAltText ?? ''}
					className="rounded-t-xl object-cover"
				/>
			</a>
			<div
				className={
					'flex h-20 w-full flex-col gap-3 rounded-b-xl bg-secondary px-3 pb-3'
				}
			>
				<h1>
					{title}
					{isDeleted ? ' (Is Deleted)' : ` ${available} available`}
				</h1>
				<Form
					className={'flex flex-row items-center justify-between'}
					method="POST"
					action={'/admin/products'}
					{...getFormProps(form)}
				>
					<StatusButton
						status={isPending ? 'pending' : (form.status ?? 'idle')}
						disabled={isPending}
						type={'submit'}
						name={'intent'}
						value={'increment'}
					>
						<Icon name={'plus'} />
					</StatusButton>
					{isDeleted ? (
						<StatusButton
							status={isPending ? 'pending' : (form.status ?? 'idle')}
							disabled={isPending}
							type={'submit'}
							name={'intent'}
							value={'re-create'}
						>
							<Icon name={'check'} />
						</StatusButton>
					) : (
						<StatusButton
							status={isPending ? 'pending' : (form.status ?? 'idle')}
							disabled={isPending}
							type={'submit'}
							name={'intent'}
							value={'delete'}
						>
							<Icon name={'trash'} />
						</StatusButton>
					)}
					<StatusButton
						status={isPending ? 'pending' : (form.status ?? 'idle')}
						disabled={isPending}
						type={'submit'}
						name={'intent'}
						value={'decrement'}
					>
						<Icon name={'minus'} />
					</StatusButton>
					<input {...getInputProps(fields.id, { type: 'hidden' })} />
				</Form>
				<ErrorList errors={form.errors} id={form.errorId} />
			</div>
		</div>
	)
}

export default function ProductsPage({
	loaderData,
	actionData,
	matches,
}: Route.ComponentProps) {
	const products = loaderData.products

	return (
		<div className={'container flex flex-row flex-wrap items-center gap-3'}>
			<div className={'flex flex-row flex-wrap items-center gap-1 md:gap-3'}>
				{products.length === 0 ? (
					<h1 className={'w-full text-center text-4xl'}>No Products</h1>
				) : null}
				{products.map((product) => {
					const wasUpdated = product.id === actionData?.id
					console.log(product)
					return (
						<ProductUpdateCard
							key={product.id}
							{...product}
							intentData={wasUpdated ? actionData : undefined}
						/>
					)
				})}
			</div>
			<Outlet />
		</div>
	)
}
