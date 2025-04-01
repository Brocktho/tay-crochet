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
		},
	})
	return { products }
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
			<div className={'h-32 w-32 rounded-b-xl bg-primary'}>a</div>
		</main>
	)
}
