import { FallbackClient, ProviderName } from "@siyegs/pay-kit";

const app_url = process.env.APP_URL;

export const initTnx = async ({
	pay,
	amount,
	email,
	invoiceId,
	currency,
}: {
	amount: number | string;
	email: string;
	invoiceId: string;
	currency: string;
	pay: FallbackClient;
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

export const verifyTnx = async (
	pay: FallbackClient,
	refrence: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	provider: ProviderName | any,
) => {
	const result = await pay.verify(provider, refrence);
	return result;
};
