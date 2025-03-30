import Stripe from 'stripe'
// process.env.STRIPE_SECRET_KEY has been added in the .env
export const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

export const createCheckoutSession = async () => {
	// get the user here somehow, either pass him in as a parameter or add
	// another function that fetches him
	const user = { email: 'email@email.com' }
	// The id of the price you created in your dashboard, this can also be an
	// argument to this function
	const price = '10.0'
	// Creates a new Checkout Session for the order
	const session = await stripe.checkout.sessions.create({
		// your site url where you want user to land after checkout completed
		success_url: 'http://localhost:3000/success',
		// your site url where you want user to land after checkout canceled
		cancel_url: 'http://localhost:3000/cancel',
		// users email, if you create a customer before this step you can assign the customer here too.
		customer_email: user.email,
		// Items to be attached to the subscription
		line_items: [
			{
				price,
				quantity: 1,
			},
		],
		mode: 'subscription',
	})
	console.log(session.url)
	// The url to redirect the user to for him to pay.
	return session.url
}
