import { useFetcher } from 'react-router'
import { prisma } from '#app/utils/db.server.ts'

export async function loader() {
	const categories = await prisma.productCategories.findMany({
		select: {
			id: true,
			category: true,
		},
	})
	return { categories }
}

export function useCategories() {
	const fetcher = useFetcher<typeof loader>()
	return {
		...fetcher,
		// overwrites the default submit so you don't have to specify the action or method
		load: () => fetcher.load('/resources/categories'),
	}
}
