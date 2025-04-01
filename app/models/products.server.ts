import { prisma } from '#app/utils/db.server.ts'

export function getProducts() {}

export function getProductById(id: string) {
	return prisma.product.findUnique({
		where: { id },
		select: {
			title: true,
			description: true,
			tags: {
				select: {
					id: true,
					tag: true,
				},
			},
			category: {
				select: {
					id: true,
					category: true,
				},
			},
			variants: {
				select: {
					id: true,
					title: true,
					imagePath: true,
					isDefault: true,
					quantity: true,
					available: true,
					price: true,
					previews: {
						select: {
							id: true,
							imageAltText: true,
							imagePath: true,
						},
					},
				},
			},
		},
	})
}
