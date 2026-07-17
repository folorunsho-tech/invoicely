import { z } from "zod";
export const schema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string(),
	_count: z.object({
		invoices: z.number(),
	}),
	organization: z.object({
		slug: z.string(),
	}),
});
