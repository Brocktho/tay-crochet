import { Route } from '../../../.react-router/types/app/routes/admin+/+types/purchases.ts'
import { requireUserWithRole } from '#app/utils/permissions.server.ts'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserWithRole(request, 'admin')

	return
}
