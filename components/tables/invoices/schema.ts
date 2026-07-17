import { z } from "zod";
export const schema = z.object({
	id: z.string(),
	invoiceNumber: z.string(),
	issued_date: z.date(),
	due_date: z.date(),
	project_subject: z.string(),
	total: z.number(),
	currency: z.string(),

	status: z.enum(["PENDING", "DRAFT", "OVERDUE", "PAID", "CANCELLED"]),
	_count: z.object({
		items: z.number(),
	}),
	organization: z.object({
		slug: z.string(),
		currencySymbol: z.string(),
	}),
	category: z.object({
		name: z.string(),
	}),
	client: z.object({
		name: z.string(),
	}),
	is_deleted: z.boolean(),
});
