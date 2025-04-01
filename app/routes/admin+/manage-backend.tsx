import { Route } from '../../../.react-router/types/app/routes/admin+/+types/manage-backend.ts'
import {
	requireUserWithPermission,
	requireUserWithRole,
} from '#app/utils/permissions.server.ts'
import { NavLink } from 'react-router'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserWithRole(request, 'admin')
	return null
}

export default function ManageBackendPage() {
	return (
		<div className={'container w-full p-6'}>
			<div
				className={
					'flex w-full flex-row flex-wrap items-center gap-3 rounded-xl bg-primary p-3'
				}
			>
				<NavLink to={'/admin/categories'}>Categories</NavLink>
				<NavLink to={'/admin/purchases'}>Purchases</NavLink>
				<NavLink to={'/admin/products'}>Products</NavLink>
			</div>
		</div>
	)
}
