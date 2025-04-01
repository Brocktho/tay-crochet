import { getProductById } from '#app/models/products.server.ts'
import { requireUserWithRole } from '#app/utils/permissions.server.ts'
import { type Route } from './+types/products.$productId_.edit'

export async function loader({ request, params }: Route.LoaderArgs) {
	await requireUserWithRole(request, 'admin')
	const product = await getProductById(params.productId)
	return { product }
}
