export const paymentGateways: {
	provider: string;
	label: string;
	countries: "Global" | string[];
	logo?: string;
	description?: string;
	fallback: string;
	rank: number;
}[] = [
	{
		provider: "flutterwave",
		label: "Flutterwave",
		countries: ["Nigeria"],
		fallback: "FW",
		logo: "/flutterwave.svg",
		rank: 1,
		description:
			"Flutterwave allows you to accept payment from cards and bank accounts in multiple currencies.",
	},
	{
		provider: "paystack",
		label: "Paystack",
		countries: ["Nigeria"],
		logo: "/paystack.svg",
		fallback: "PS",
		rank: 2,
		description:
			"Paystack helps African merchants accept one-time and recurring payments online with a modern, safe, and secure payment gateway.",
	},
];
