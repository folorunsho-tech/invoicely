import { z } from "zod";
export const schema = z.object({
	id: z.string(),
	role: z.string(),
	userId: z.string(),
	organizationId: z.string(),
	createdAt: z.date(),
	user: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		image: z.string().optional(),
	}),
});
