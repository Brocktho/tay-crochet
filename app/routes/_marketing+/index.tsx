import { type Route } from './+types/index.ts'
import { logos } from './logos/logos.ts'
import { prisma } from '#app/utils/db.server.ts'
import { Outlet } from 'react-router'

export const meta: Route.MetaFunction = () => [{ title: 'Tay Crochet' }]

export async function loader({}: Route.LoaderArgs) {
	const products = await prisma.product.findMany({
		where: {},
		include: {
			variants: true,
			previews: true,
		},
	})
	return { products }
}

// Tailwind Grid cell classes lookup
const columnClasses: Record<(typeof logos)[number]['column'], string> = {
	1: 'xl:col-start-1',
	2: 'xl:col-start-2',
	3: 'xl:col-start-3',
	4: 'xl:col-start-4',
	5: 'xl:col-start-5',
}
const rowClasses: Record<(typeof logos)[number]['row'], string> = {
	1: 'xl:row-start-1',
	2: 'xl:row-start-2',
	3: 'xl:row-start-3',
	4: 'xl:row-start-4',
	5: 'xl:row-start-5',
	6: 'xl:row-start-6',
}

export default function Index({ loaderData }: Route.ComponentProps) {
	const products = loaderData.products
	return (
		<main className="font-poppins grid h-full place-items-center">
			<div className={'flex w-full flex-row flex-wrap justify-center gap-3'}>
				{products.map((product) => {
					return <div key={product.id} className={'flex flex-1'}></div>
				})}
			</div>
		</main>
	)
}
