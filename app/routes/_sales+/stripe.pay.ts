import { data, redirect, useFetcher } from 'react-router'
import { createCheckoutSession } from '#app/utils/stripe.server'
import { Route } from '../../../.react-router/types/app/routes/_sales+/+types/stripe.pay.ts'

export const action = async ({ request }: Route.ActionArgs) => {
	console.log('in action')
	const url = await createCheckoutSession()
	console.log(url)
	if (!url) {
		return data({ error: 'something went wrong' }, { status: 500 })
	}
	return redirect(url)
}

/**
 * Used to redirect the user to the Stripe checkout page
 * @returns A custom fetcher with extended submit function
 */
export const useStripeCheckout = () => {
	const fetcher = useFetcher<typeof action>()
	return {
		...fetcher,
		// overwrites the default submit so you don't have to specify the action or method
		submit: () =>
			fetcher.submit(null, { method: 'POST', action: '/stripe/pay' }),
	}
}
