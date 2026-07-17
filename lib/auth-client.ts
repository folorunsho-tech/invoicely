import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import {
	organizationClient,
	inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { ac, owner, admin, member, editor } from "@/lib/permissions";
import type { auth } from "@/lib/auth";
export const authClient = createAuthClient({
	plugins: [
		emailOTPClient(),
		organizationClient({
			ac,
			roles: {
				owner,
				admin,
				member,
				editor,
			},
			schema: inferOrgAdditionalFields<typeof auth>(),
		}),
	],
});
