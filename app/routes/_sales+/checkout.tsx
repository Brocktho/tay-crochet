import {Elements, PaymentElement} from '@stripe/react-stripe-js';
import {Suspense} from "react";
import {Await, Form, useOutletContext} from "react-router";
import Stripe from 'stripe';
import  {type Route} from "../../../.react-router/types/app/routes/_sales+/+types/checkout.ts";
import {getDomainUrl} from "#app/utils/misc.tsx";
import {RootContext} from "#app/root.tsx";
import {ClientOnly} from "remix-utils/client-only";
export async function loader({request}: Route.LoaderArgs){
    const host = getDomainUrl(request);
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
    const customer = await stripe.customers.create();
    const ephemeralKeyPromise = stripe.ephemeralKeys.create(
        {
            customer: customer.id,
        },
        {apiVersion: "2025-02-24.acacia"}
    )
    const payIntentSecretPromise = stripe.paymentIntents.create({
        amount: 150,
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true,
        },

    }).then(resp => resp.client_secret);
    return {payIntentSecretPromise, ephemeralKeyPromise, stripe};
}
const CheckoutForm = () => {
    return (
        <Form>
            <div></div>
            <PaymentElement />
            <button type="submit">Submit</button>
        </Form>
    )
}

type CheckoutMainProps = {
    payIntentSecret: string | null;
};
const CheckoutMain = ({
    payIntentSecret,
                      } : CheckoutMainProps) => {
    const rootContext = useOutletContext<RootContext>();
    const options = {
        clientSecret: payIntentSecret ?? "Error!"
    };

    return (
        <Elements stripe={rootContext.stripePromise} options={options}>
            <CheckoutForm/>
        </Elements>
    )
}


export default function CheckoutPage({loaderData} : Route.ComponentProps){

    return (
        <ClientOnly fallback={<>loading Stripe</>}>
            {() => <Suspense fallback={<>loading React</>}>
                <Await resolve={loaderData.payIntentSecretPromise}>
                    {(payIntent) => <CheckoutMain payIntentSecret={payIntent}/>}
                </Await>
            </Suspense>
            }
        </ClientOnly>
    )

}
