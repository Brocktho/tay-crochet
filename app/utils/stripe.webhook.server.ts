import type Stripe from 'stripe'
import { stripe } from './stripe.server'

const getStripeEventOrThrow = async (request: Request) => {
	const signature = request.headers.get('stripe-signature')
	const payload = await request.text()
	let event: Stripe.Event

	if (!signature || !payload) {
		throw new Response('Invalid Stripe payload/signature', {
			status: 400,
		})
	}
	try {
		event = stripe.webhooks.constructEvent(
			payload,
			signature,
			process.env.STRIPE_PUBLIC_KEY,
		)
	} catch (err: any) {
		throw new Response(err.message, {
			status: 400,
		})
	}
	return event
}

export const handleStripeWebhook = async (request: Request) => {
	const event = await getStripeEventOrThrow(request)

	if (
		event.type === 'checkout.session.completed' ||
		event.type === 'checkout.session.async_payment_succeeded'
	) {
		// This will trigger every time a user pays for the subscription
		const session = event.data.object
		// We get the subscription that was created
		const subscription = session.subscription
		// We somehow store it in our database or do whatever we need to
		// TOOD: store result in db
	}

	return null
}
