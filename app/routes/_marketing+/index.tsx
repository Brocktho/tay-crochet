import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/index.ts'

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
			<img
				className="relative -z-10 -mt-24 h-[52rem] w-full object-cover"
				src="/img/TayCrochetBanner.jpg"
				alt="Welcome To Tay Crochet"
			/>
			<div className={'flex w-full flex-row flex-wrap justify-center gap-3'}>
				{products.map((product) => {
					return <div key={product.id} className={'flex flex-1'}></div>
				})}
			</div>
			<div className={'h-32 w-32 rounded-b-xl bg-primary'}>a</div>
		</main>
	)
}
