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
			<h1 className="text-xl">Welcome!</h1>
			<p className="w-full text-center text-lg">
				I’m Taylor, and I create adorable, handmade crochet plushies, perfect
				for gifting or adding a little charm to your space. Right now, I
				specialize in basic animal designs, but I’m more than happy to modify
				them to fit your vision! Each plushie is crafted with love and attention
				to detail, though I’m not a professional – I’m just doing what I love!
				While they might not be perfect, I promise to always do my best to
				create something special just for you. If you have a custom plushie idea
				in mind, feel free to reach out – I’d love to try my best to bring your
				vision to life, as long as I believe I can provide you with a quality
				product. Take a look around, and let’s create something unique together!
			</p>
			<div className={'flex w-full flex-row flex-wrap justify-center gap-3'}>
				{products.map((product) => {
					return <div key={product.id} className={'flex flex-1'}></div>
				})}
			</div>
			<div className={'h-32 w-32 rounded-b-xl bg-primary'}>a</div>
		</main>
	)
}
