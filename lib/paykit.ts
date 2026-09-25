import { createFallbackClient, ProviderName } from "@siyegs/pay-kit";

const app_url = process.env.APP_URL;
const pay = createFallbackClient({
	providers: [
		{
			provider: "flutterwave",
			secretKey: process.env.FLUTTERWAVE_SECRET_KEY!,
			webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET!,
		},
		{
			provider: "paystack",
			secretKey: process.env.PAYSTACK_SECRET_KEY!,
		},
	],
});
export const initTnx = async ({
	amount,
	email,
	invoiceId,
	currency,
}: {
	amount: number | string;
	email: string;
	invoiceId: string;
	currency: string;
}) => {
	const subunits = Number(amount) * 100;
	const { reference, authorizationUrl, accessCode, provider } =
		await pay.initialize({
			amount: subunits,
			email,
			metadata: {
				invoiceId,
			},
			currency,
			callbackUrl: app_url + "/pay/verify",
		});

	return { reference, authorizationUrl, accessCode, provider };
};

export const verifyTnx = async (refrence: string, provider: ProviderName) => {
	const result = await pay.verify(provider, refrence);
	return result;
};
