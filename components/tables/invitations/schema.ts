import { z } from "zod";
export const schema = z.object({
	id: z.string(),
	email: z.string(),
	status: z.string(),
	role: z.string(),
	inviterId: z.string(),
	organizationId: z.string(),
	expiresAt: z.date(),
	createdAt: z.date(),
	user: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		image: z.string().optional(),
	}),
});
