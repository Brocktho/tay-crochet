import type { Route } from './+types/product-images.$variantId.ts'
import { invariantResponse } from '@epic-web/invariant'
import { prisma } from '#app/utils/db.server.ts'
import { getSignedGetRequestInfo } from '#app/utils/storage.server.ts'

export async function loader({ params }: Route.LoaderArgs) {
	invariantResponse(params.variantId, 'Variant ID is required', { status: 400 })
	const productImage = await prisma.productVariant.findUnique({
		where: { id: params.variantId },
		select: { imagePath: true },
	})
	invariantResponse(productImage, 'Variant image not found', { status: 404 })

	const { url, headers } = getSignedGetRequestInfo(productImage.imagePath)
	const response = await fetch(url, { headers })

	const cacheHeaders = new Headers(response.headers)
	cacheHeaders.set('Cache-Control', 'public, max-age=31536000, immutable')

	return new Response(response.body, {
		status: response.status,
		headers: cacheHeaders,
	})
}
