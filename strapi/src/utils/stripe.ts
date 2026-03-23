import stripe from 'stripe';
import { generateToken } from './helper';

let Stripe: stripe | null = null;

export async function getInvoices(stripeID: string, limit?: number){
    if(Stripe == null){
        Stripe = new stripe(process.env.STRIPE_KEY ?? "");
    }
  return await Stripe.invoices.search({
    query: `customer:'${stripeID}'`,
    limit
  });
}

export async function genCheckout(price: number, product: string, provider: string, email: string, discount?: string) {
    if(Stripe == null){
        Stripe = new stripe(process.env.STRIPE_KEY ?? "");
    }
    const token = generateToken({
        product,
        value: price,
        currency: 'USD',
        exp: Date.now() / 1000 + 3600
    });
    const params: stripe.Checkout.SessionCreateParams = {
        customer_email: email,
        success_url: `${process.env.FRONTEND_URL}/thank-you?token=${token}`,
        line_items: [
            {
                price_data: {
                    product_data:{
                        name: product,
                        description: `${product} procedure with ${provider}.`
                    },
                    unit_amount: Math.floor(price * 100),
                    currency: "USD"
                },
                quantity: 1
            }
        ],
        mode: "payment"
    };
    if(discount){
        params.discounts = [
            {
                coupon: discount
            }
        ]
    }
    return await Stripe.checkout.sessions.create(params)
}

export function generateWebhookEvent(payload: string | Buffer, header: string | Buffer | Array<string>){
    if(Stripe == null){
        Stripe = new stripe(process.env.STRIPE_KEY ?? "");
    }
    return Stripe.webhooks.constructEvent(payload, header, process.env.STRIPE_ENDPOINT_SECRET ?? "")
}

export type PriceData = stripe.Checkout.SessionCreateParams.LineItem.PriceData;
export type LineItem = stripe.Checkout.SessionCreateParams.LineItem;
export type CreateInvoiceItemParam = stripe.InvoiceItemCreateParams;
export type CheckoutSession = stripe.Checkout.Session;
export type Invoice = stripe.Invoice;