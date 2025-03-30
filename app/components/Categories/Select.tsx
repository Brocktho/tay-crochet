import { useEffect } from 'react'
import { Combobox } from '#app/components/ui/combobox.tsx'
import { useCategories } from '#app/routes/resources+/categories.tsx'
import { ProductCategories } from '@prisma/client'

export function CategoryGetOption(
	category: Pick<ProductCategories, 'category' | 'id'>,
) {
	return { value: category.id, label: category.category }
}

export default function CategorySelect() {
	const fetcher = useCategories()
	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data === undefined) {
			void fetcher.load()
		}
	}, [fetcher, fetcher.state, fetcher.data])
	return (
		<Combobox
			label={'Category'}
			placeholder={'Choose a category...'}
			data={fetcher.data?.categories.map(CategoryGetOption) || []}
			emptyText={'No Categories found.'}
		/>
	)
}
