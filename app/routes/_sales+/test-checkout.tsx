import { useStripeCheckout } from './stripe.pay'

export default function TestCheckout() {
	const fetcher = useStripeCheckout()
	return (
		<>
			<button onClick={fetcher.submit}>That was dumb</button>
			{fetcher.state !== 'idle' && <p>loading</p>}
		</>
	)
}
