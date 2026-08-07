/* eslint-disable @typescript-eslint/no-explicit-any */

const app_url = process.env.APP_URL;
// const pay = createPayClient({ provider: "mock" });
export const initTnx = async ({
	amount,
	email,
	invoiceId,
	currency,
	pay,
}: {
	amount: number | string;
	email: string;
	invoiceId: string;
	currency: string;
	pay: any;
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

export const verifyTnx = async (refrence: string, provider: any, pay: any) => {
	const result = await pay.verify(provider, refrence);
	return result;
};
