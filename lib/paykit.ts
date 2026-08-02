import { createFallbackClient } from "@siyegs/pay-kit";
const pay = createFallbackClient({
	providers: [
		{
			provider: "flutterwave",
			secretKey: process.env.FLW_SECRET_KEY!,
			webhookSecret: process.env.FLW_HASH,
		},
		{ provider: "paystack", secretKey: process.env.PAYSTACK_SECRET_KEY! },
	],
});
// const pay = createPayClient({ provider: "mock" });
const app_url = process.env.APP_URL;
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
			callbackUrl: app_url + "/pay/status",
		});

	return { reference, authorizationUrl, accessCode, provider };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyTnx = async (refrence: string, provider: any) => {
	const result = await pay.verify(provider, refrence);
	return result;
};
