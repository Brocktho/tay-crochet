import { handleStripeWebhook } from '#app/utils/stripe.webhook.server'
import { Route } from '../../.react-router/types/app/routes/+types/webhook.stripe.ts'

export const action = ({ request }: Route.ActionArgs) => {
	console.log('Request made to webhook')
	return handleStripeWebhook(request)
}
