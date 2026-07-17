import { z } from "zod";
export const schema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	address: z.string(),
	city: z.string(),
	state: z.string(),
	postCode: z.string(),
	country: z.string(),
	_count: z.object({
		invoices: z.number(),
	}),
	organization: z.object({
		slug: z.string(),
	}),
});
