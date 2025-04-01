import { type ProductCategories } from '@prisma/client'
import { useEffect } from 'react'
import { Combobox, type ComboboxProps } from '#app/components/ui/combobox.tsx'
import { useCategories } from '#app/routes/resources+/categories.tsx'

export function CategoryGetOption(
	category: Pick<ProductCategories, 'category' | 'id'>,
) {
	return { value: category.id, label: category.category }
}

export type CategorySelectProps<T extends string> = {} & Omit<
	ComboboxProps<T>,
	'options'
>

export default function CategorySelect(props: CategorySelectProps<string>) {
	const fetcher = useCategories()
	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data === undefined) {
			void fetcher.load()
		}
	}, [fetcher, fetcher.state, fetcher.data])
	return (
		<Combobox
			{...props}
			label={'Category'}
			placeholder={'Choose a category...'}
			options={fetcher.data?.categories.map(CategoryGetOption) || []}
			emptyText={'No Categories found.'}
		/>
	)
}
