export const paymentGateways: {
	provider: string;
	countries: "Global" | string[];
	logo?: string;
	description?: string;
	fallback: string;
}[] = [
	{
		provider: "Paystack",
		countries: ["Nigeria"],
		logo: "/paystack.svg",
		fallback: "PS",
		description:
			"Paystack helps African merchants accept one-time and recurring payments online with a modern, safe, and secure payment gateway.",
	},
	// {
	// 	provider: "Flutterwave",
	// 	countries: ["Nigeria"],
	// 	fallback: "FW",
	// 	logo: "/flutterwave.svg",
	// 	description: "",
	// },
];
