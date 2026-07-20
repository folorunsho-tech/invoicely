import { z } from "zod";
export const schema = z.object({
	id: z.string(),
	type: z.string(),
	amount: z.string(),
	provider_transaction_id: z.string().nullable(),
	status: z.string(),
	channel: z.string(),
	paid_at: z.date(),

	invoice: z.object({
		invoiceNumber: z.string(),
		client: z.object({
			name: z.string(),
			email: z.email(),
		}),
	}),
	gateway: z.object({
		provider: z.string(),
	}),
	organization: z.object({
		slug: z.string(),
		currencySymbol: z.string(),
	}),
});
